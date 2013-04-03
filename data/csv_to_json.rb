#!/usr/bin/env ruby

require 'csv'
require 'json'

input = CSV.open(ARGV[0])

facilities = {}

input.each do |i|
  category, name, addr, desc, phone, hours, notes, _, demos, bathrooms = *i
  next if name == 'Name'

  facilities[name] ||= {name: name, phone: phone, address: addr, description: "", notes: "", services: []}

  facilities[name][:services] << {
    category: category,
    name: category,
    hours: hours,
    description: desc,
    notes: notes,
    gender: gender,
    ages: ages
  }
end

puts JSON.pretty_generate(facilities.values)
