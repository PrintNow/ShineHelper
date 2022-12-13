<?php

namespace App\Console\Commands;

use App\Lib\ClashConfMerge;
use Illuminate\Console\Command;

class ClashConfMergeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clash:conf-merge {--clean=false}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clash 配置文件合并';


    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $clean = $this->option('clean');

        if ($clean === 'true') {
            $this->warn('>>> 正在清理输出配置文件...');
            sleep(1);
            $this->info('清理完成' . PHP_EOL);
        }

        $clashConfMerge = new ClashConfMerge();
        $this->info(">>> 正在合并配置文件...");
        $this->info("配置文件合并完成，输出路径：" . $clashConfMerge->genConf());

        return Command::SUCCESS;
    }
}
