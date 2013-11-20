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
    bucket = "ttl-link-sf-production"

    deploy_glob = %w(
      js/static/output-*.js
      js/static/admin-*.js
      css/static/user-*.css
      css/static/admin-*.css
      index.html
      admin.html
    )
    Dir.glob(deploy_glob).each do |d|
      system("#{s3cmd} put --acl-public #{d} s3://#{bucket}/#{d}")
    end

    # deploy everything in vendor
    system("#{s3cmd} sync --acl-public vendor/ s3://#{bucket}/vendor/")

    # deploy everything in images
    system("#{s3cmd} sync --acl-public images/ s3://#{bucket}/images/")
  end

  task :parse do
    system("cd #{File.dirname(__FILE__) + '/server'} && parse deploy")
  end

end

task :grunt do
  abort unless system("grunt")
end

task :clean do 
  system("rm {js,css}/static/*")
end

task :deploy => ['clean', 'grunt', 'deploy:parse', 'deploy:s3']
