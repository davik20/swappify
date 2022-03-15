import React, { useEffect, useRef } from 'react'
// listens clicks outside a Dom element, ignores dom elements passed as an array
function useClickOutside(target: React.MutableRefObject<undefined>, toIgnore, func: any) {
  useEffect(() => {
    const listener = document.addEventListener('click', e => {
      if (target.current && toIgnore.current.length > 0) {
        let toReturn: boolean = false
        toIgnore.current.forEach(target => {
          if (target.contains(e.target)) {
            toReturn = true
          }
        })
        if (toReturn) {
          return
        } else if (!target.current.contains(e.target)) {
          func()
        }
      }
    })
    return () => {
      document.removeEventListener('click', listener)
    }
  }, [target, toIgnore])
}

export default useClickOutside
