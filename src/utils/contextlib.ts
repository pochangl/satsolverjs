
type IContextManager = (exec: () => any) => void
type Decorator = (target: any, key?: string, descriptor?: PropertyDescriptor) => any

function allows_class_method(decorator: IContextManager): Decorator {
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

export function contextmanager(managerFunction: IContextManager): Decorator {
  // imitate python context manager
  return allows_class_method((wrappedFunc: (..._args) => any) => {
    return function decorator(...args: any[]) {
      let result
      const executor = () => {
        result = wrappedFunc.apply(this, args)
        if (!(result instanceof Promise)) {
          return result
        }
      }
      managerFunction.bind(this)(executor)
      return result
    }
  })
}
