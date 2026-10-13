import { useEffect, useId, useRef, useState } from 'react';
import { getNavigationTarget } from '../lib/navigation.js';

export function BackLink ({ onBack }) {
  return (
    <a
      className='pr-back'
      href={window.location.pathname}
      onClick={(event) => {
        if (!getNavigationTarget(event, event.currentTarget, window.location.href)) return;
        event.preventDefault();
        onBack();
      }}
    >
      <span aria-hidden='true'>←</span> All contests
    </a>
  );
}

export function LoadState ({ status, error, loadingLabel, errorLabel, onRetry, retryLabel = 'Try again' }) {
  if (status === 'error') {
    return (
      <div className='pr-state' role='alert'>
        <p className='pr-state-title'>{errorLabel}</p>
        <p className='pr-state-detail'>
          Check your connection and try again.{error ? ` (${error})` : ''}
        </p>
        <button className='pr-button' type='button' onClick={onRetry}>{retryLabel}</button>
      </div>
    );
  }

  return (
    <div className='pr-state' role='status'>
      <p className='pr-state-title pr-state-loading'>{loadingLabel}</p>
    </div>
  );
}

// A button + listbox select. The menu is styled with the page instead of the
// operating system, and follows the WAI-ARIA select-only combobox keys.
export function Select ({ label, value, options, onChange, className = '' }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const labelId = useId();
  const listId = useId();
  const valueId = useId();
  const selectedIndex = Math.max(options.findIndex((option) => option.value === value), 0);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const show = (index = selectedIndex) => {
    setActive(index);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const choose = (index) => {
    const option = options[index];
    if (option && option.value !== value) onChange(option.value);
    close();
  };

  const handleButtonKey = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      show();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      show(event.key === 'Home' ? 0 : options.length - 1);
    }
  };

  const handleListKey = (event) => {
    const moves = {
      ArrowDown: Math.min(active + 1, options.length - 1),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: options.length - 1
    };
    if (event.key in moves) {
      event.preventDefault();
      setActive(moves[event.key]);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choose(active);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div className={`pr-select ${className}`} ref={rootRef}>
      <span className='pr-select-label' id={labelId}>{label}</span>
      <div className='pr-select-control'>
        <button
          className='pr-select-button'
          type='button'
          ref={buttonRef}
          aria-haspopup='listbox'
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-labelledby={`${labelId} ${valueId}`}
          onClick={() => (open ? close() : show())}
          onKeyDown={handleButtonKey}
        >
          <span className='pr-select-value' id={valueId}>{selected?.label}</span>
          <span className='pr-select-caret' aria-hidden='true' />
        </button>
        {open
          ? (
            <ul
              className='pr-select-menu'
              id={listId}
              ref={listRef}
              role='listbox'
              tabIndex={-1}
              aria-labelledby={labelId}
              aria-activedescendant={`${listId}-${active}`}
              onKeyDown={handleListKey}
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  id={`${listId}-${index}`}
                  role='option'
                  aria-selected={index === selectedIndex}
                  data-active={index === active ? '' : undefined}
                  onPointerMove={() => setActive(index)}
                  onClick={() => choose(index)}
                >
                  <span>{option.label}</span>
                  {option.count !== undefined
                    ? (
                      <span className='pr-select-count'>
                        <span className='sr-only'>, </span>
                        {option.count}
                        <span className='sr-only'> {option.count === 1 ? 'test' : 'tests'}</span>
                      </span>
                      )
                    : null}
                </li>
              ))}
            </ul>
            )
          : null}
      </div>
    </div>
  );
}
