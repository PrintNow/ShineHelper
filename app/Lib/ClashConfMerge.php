<?php

namespace App\Lib;

use Illuminate\Support\Str;
use Symfony\Component\Yaml\Yaml;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class ClashConfMerge
{

    protected Collection $proxies;
    protected Collection $proxiesNames;

    public const AUTO_SELECT_TEXT = '🤖️ 自动选择服务器';

    public function __construct()
    {
        $this->proxies = collect();
        $this->proxiesNames = collect();
    }

    public function genConf(): string
    {
        $proxyGroups = $this->handleProxies()->genProxyGroups();
        $data = Yaml::dump([
            'port' => 7890,
            'socks-port' => 7890,
            'allow-lan' => true,
            'mode' => 'Rule',
            'log-level' => 'info',
            'external-controller' => 60919,
            'proxies' => $this->proxies->toArray(),
            'proxy-groups' => $proxyGroups,
            'rules' => $this->genRules(),
        ]);

        $filename = sprintf("clash-output/clash_%s.yaml", now()->format('Y-m-d_H:i:s'));
        Storage::disk('local')->put($filename, $data);

        return storage_path("app/{$filename}");
    }

    private function handleProxies(): self
    {
        $rulesData = [];
        foreach (Storage::files('/clash/') as $file) {
            if (!Str::endsWith($file, ['.yaml', '.yml'])) {
                continue;
            }
            echo "\t处理文件：{$file}" . PHP_EOL;
            ['proxies' => $proxies, 'rules' => $rules] = Yaml::parse(Storage::get($file), Yaml::PARSE_CUSTOM_TAGS);
            $this->proxies = $this->proxies->concat($proxies);
            $rulesData = [...$rulesData, $rules];
        }

        $this->proxiesNames = $this->proxies->pluck('name');

        return $this;
    }

    private function genProxyGroups(): array
    {
        $proxyNames = $this->proxiesNames->toArray();
        return [
            [
                'name' => 'Proxy',
                'type' => 'select',
                'proxies' => [self::AUTO_SELECT_TEXT, 'DIRECT', ...$proxyNames],
            ],
            [
                'name' => self::AUTO_SELECT_TEXT,
                'type' => 'url-test',
                'url' => 'https://www.gstatic.com/generate_204',
                'interval' => 300,
                'tolerance' => 50,
                'proxies' => $proxyNames,
            ],
        ];
    }

    private function genRules()
    {
        return config('clash-rules');
    }
}
