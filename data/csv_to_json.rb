#!/usr/bin/env ruby

require 'csv'
require 'json'

input = CSV.open(ARGV[0])

facilities = {}

input.each do |i|
  category, name, addr, desc, phone, hours, notes, _, gender, age, bathrooms = *i
  next if name == 'Name'

  age = Array(age.split(',').map(&:strip)) if age
  facilities[name] ||= {name: name, phone: phone, address: addr, description: "", notes: "", services: [], hours: {}}
  facilities[name][:gender] ||= gender
  facilities[name][:age] ||= age

  facilities[name][:services] << {
    category: category,
    name: category,
    hours: hours,
    description: desc,
    notes: notes
  }
end

puts 'fixtureData = ' + JSON.pretty_generate(facilities.values.sort_by { |h| h[:name] })
