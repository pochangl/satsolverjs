
type IContextManager<T> = (exec: () => any, instance: T) => void
type ClassMethodDecorator = (target: any, key?: string, descriptor?: PropertyDescriptor) => any

function allows_class_method<T>(decorator: (..._args) => any): ClassMethodDecorator {
  // enables function decorator to decorate class method as well
  function wrapper(target: () => any | { [key: string]: () => any }, key?: string, descriptor?: PropertyDescriptor) {
    if (descriptor) {
      const func: () => any = descriptor.value
      descriptor.value = decorator(func)
      return descriptor
    }
    return decorator(target)
  }
  return wrapper
}

export function contextmanager<T>(managerFunction: IContextManager<T>): ClassMethodDecorator {
  // imitate python context manager
  return allows_class_method<T>((wrappedFuncOuter: (..._args) => any) => {
    return function (...args: any[]) {
      let result
      const executor = () => {
        result = wrappedFuncOuter.apply(this, args)
        if (!(result instanceof Promise)) {
          return result
        }
      }
      managerFunction.bind(this)(executor, this)
      return result
    }
  })
}
