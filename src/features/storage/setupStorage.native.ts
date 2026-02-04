import { setStorageDriver } from '@take-out/helpers'
import { createMMKV } from 'react-native-mmkv'

const mmkv = createMMKV({ id: 'app-storage-2' })

setStorageDriver({
  getItem: (key) => mmkv.getString(key) ?? null,
  setItem: (key, value) => mmkv.set(key, value),
  removeItem: (key) => mmkv.remove(key),
  getAllKeys: () => mmkv.getAllKeys(),
})
