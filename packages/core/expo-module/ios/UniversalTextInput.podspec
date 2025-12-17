Pod::Spec.new do |s|
  s.name           = 'UniversalTextInput'
  s.version        = '0.1.0'
  s.summary        = 'Universal text input Expo module'
  s.description    = 'A cross-platform text input component for Expo'
  s.author         = ''
  s.homepage       = 'https://github.com/example/universal-text-input'
  s.platforms      = { :ios => '15.1', :tvos => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = '**/*.{h,m,mm,swift,hpp,cpp}'
end
