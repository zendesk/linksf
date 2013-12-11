require 'dotenv/tasks'

namespace :deploy do
  task :s3 do
    s3cfg = File.expand_path(File.dirname(__FILE__) + "/s3cfg")
    if `which s3cmd`.chomp.empty?
      puts 'please install and configure s3cmd'
      exit
    end

    if !File.exist?(s3cfg)
      puts "please copy s3cfg.example to s3cfg and configure"
      exit
    end

    s3cmd = "s3cmd -c #{s3cfg}"
    bucket = $bucket || abort("please call deploy:production or deploy:development")

    deploy_glob = %w(
      build/*.js
      build/*.css
      index.html
      admin.html
    )
    Dir.glob(deploy_glob).each do |d|
      system("#{s3cmd} put --acl-public #{d} s3://#{bucket}/#{d}")
    end

    # deploy everything in vendor/font
    system("#{s3cmd} sync --acl-public vendor/font s3://#{bucket}/vendor/font")

    # deploy everything in images
    system("#{s3cmd} sync --acl-public img/ s3://#{bucket}/img/")
  end

  task :parse do
    system("cd #{File.dirname(__FILE__) + '/server'} && parse deploy #{$parse_target}")
  end

  task :setup_production => :dotenv do
    abort unless system("grunt", "build:production")
    $bucket = "www.link-sf.com"
    $parse_target = '"Link SF"'
    ENV['PARSE_APP_ID'] = ENV['PARSE_PROD_APP_ID']
    ENV['PARSE_JS_KEY'] = ENV['PARSE_PROD_JS_KEY']
  end

  task :setup_development => :dotenv do
    abort unless system("grunt", "build:development")
    $bucket = "dev.link-sf.com"
    $parse_target = '"Link SF -- Development"'
    ENV['PARSE_APP_ID'] = ENV['PARSE_DEV_APP_ID']
    ENV['PARSE_JS_KEY'] = ENV['PARSE_DEV_JS_KEY']
  end

  task :production => ['clean', 'deploy:setup_production', 'deploy', 'clean']
  task :development => ['clean', 'deploy:setup_development', 'deploy', 'clean']
end

task :clean do
  system 'rm', 'build/*'
end

task :deploy => ['deploy:parse', 'deploy:s3']
