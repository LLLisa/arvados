# Copyright (C) The Arvados Authors. All rights reserved.
#
# SPDX-License-Identifier: AGPL-3.0

if not File.exist?('/usr/bin/git') then
  STDERR.puts "\nGit binary not found, aborting. Please install git and run gem build from a checked out copy of the git repository.\n\n"
  exit
end

version = `#{__dir__}/../../build/version-at-commit.sh HEAD`.encode('utf-8').strip
git_timestamp, git_hash = `git log -n1 --first-parent --format=%ct:%H .`.chomp.split(":")
git_timestamp = Time.at(git_timestamp.to_i).utc

Gem::Specification.new do |s|
  s.name        = 'arvados-login-sync'
  s.version     = version
  s.date        = git_timestamp.strftime("%Y-%m-%d")
  s.summary     = "Set up local login accounts for Arvados users"
  s.description = "Creates and updates local login accounts for Arvados users. Built from git commit #{git_hash}"
  s.authors     = ["Arvados Authors"]
  s.email       = 'gem-dev@curoverse.com'
  s.licenses    = ['GNU Affero General Public License, version 3.0']
  s.files       = ["bin/arvados-login-sync", "agpl-3.0.txt"]
  s.executables << "arvados-login-sync"
  s.required_ruby_version = '>= 2.1.0'
  s.add_runtime_dependency 'arvados', '~> 1.3.0', '>= 1.3.0'
  # arvados-google-api-client 0.8.7.2 is incompatible with faraday 0.16.2
  s.add_dependency('faraday', '< 0.16')
  # arvados-google-api-client (and thus arvados) gems
  # depend on signet, but signet 0.12 is incompatible with ruby 2.3.
  s.add_dependency('signet', '< 0.12')
  s.homepage    =
    'https://arvados.org'
end
