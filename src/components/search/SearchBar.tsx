import { useRef, useLayoutEffect, useContext } from 'react';
import { debounceTime, fromEvent, map, distinctUntilChanged, Subscription } from 'rxjs';

import { PlacesContext } from '../../context/index'
import { SearchResults } from './SearchResults';

export const SearchBar = () => {

  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputSubs = useRef<Subscription | null>(null)

  const { searchPlacesByTerm } = useContext( PlacesContext )

  useLayoutEffect(() => {

    if (inputRef.current) {

      inputSubs.current = fromEvent( inputRef.current, 'keyup' )
        .pipe(
          debounceTime(1000),
          map(({ target }) => (target as any).value),
          distinctUntilChanged()
        )
        .subscribe({
          next: (query: string) => {
            searchPlacesByTerm(query)
          }
        })
        
    }

    return () => {
      inputSubs.current?.unsubscribe()
    }

  }, [])

  return (
    <div className='search-container'>
      <input 
        ref = { inputRef }
        type="text" 
        className="form-control"
        placeholder="Buscar lugar"
      />

      <SearchResults />
    </div>
  )
}
