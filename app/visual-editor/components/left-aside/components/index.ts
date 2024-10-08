import type { DefineComponent } from 'vue'

const modules = import.meta.glob('./*/index.(tsx|vue)')

const components: Record<string, DefineComponent> = {}
console.log('left-aside modules:', modules)

for (const path in modules) {
  const comp = modules?.[path]?.default
  components[comp?.name || path.split('/')[1]] = comp
}
// console.log('left-aside components:', components)

export default components
