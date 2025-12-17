import { NativeModule, requireNativeModule } from 'expo-modules-core';

declare class UniversalTextInputModuleType extends NativeModule {
  // Add any native module methods here if needed
}

export default requireNativeModule<UniversalTextInputModuleType>('UniversalTextInput');
