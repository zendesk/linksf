namespace :deploy do
  task :s3 do
    if `which s3cmd`.chomp.empty?
      puts 'please install and configure s3cmd'
    end
    deploy_glob = %w(
      build/*.js
      build/*.css
      index.html
      admin.html
    )
    Dir.glob(deploy_glob).each do |d|
      system("s3cmd put --acl-public #{d} s3://www.link-sf.com/#{d}")
    end

    # deploy everything in vendor/img
    system("s3cmd sync --acl-public vendor/img/ s3://www.link-sf.com/vendor/img/")

    # deploy everything in vendor/font
    system("s3cmd sync --acl-public vendor/font/ s3://www.link-sf.com/vendor/font/")

    # deploy everything in images
    system("s3cmd sync --acl-public images/ s3://www.link-sf.com/images/")
  end

  task :parse do
    system("cd #{File.dirname(__FILE__) + '/server'} && parse deploy")
  end

end

task :grunt do
  abort unless system("grunt release")
end

task :clean do
  system("rm build/*")
end

task :deploy => ['clean', 'grunt', 'deploy:parse', 'deploy:s3']
