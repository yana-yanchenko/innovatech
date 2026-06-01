import 'server-only'
import { typographDeep } from './typography'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  ru: () => import('@/dictionaries/ru.json').then((module) => module.default),
  kk: () => import('@/dictionaries/kk.json').then((module) => module.default),
}

type Dictionary = Awaited<ReturnType<typeof dictionaries.en>>

// Кэш словарей с уже расставленной типографикой, чтобы не обрабатывать на каждый запрос.
const cache = new Map<string, Dictionary>()

export const getDictionary = async (locale: 'en' | 'ru' | 'kk'): Promise<Dictionary> => {
  const cached = cache.get(locale)
  if (cached) return cached

  const loader = dictionaries[locale] ?? dictionaries.en
  const raw = (await loader()) as Dictionary
  const dict = typographDeep(raw)
  cache.set(locale, dict)
  return dict
}
