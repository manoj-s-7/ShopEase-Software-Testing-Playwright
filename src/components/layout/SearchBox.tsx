import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface Props {
  testPrefix: string;
  onSearched?: () => void;
  className?: string;
}

export default function SearchBox({ testPrefix, onSearched, className = '' }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(location.pathname === '/shop' ? (new URLSearchParams(location.search).get('q') ?? '') : '');
  }, [location.pathname, location.search]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const term = value.trim();
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop');
    onSearched?.();
  };

  return (
    <form role="search" onSubmit={submit} className={`relative ${className}`} noValidate>
      <label htmlFor={`${testPrefix}-input`} className="sr-only">
        Search products
      </label>
      <input
        id={`${testPrefix}-input`}
        type="search"
        data-testid={`${testPrefix}-input`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products"
        autoComplete="off"
        className="h-10 w-full rounded-[10px] border border-line bg-surface pl-3.5 pr-10 text-sm text-ink outline-none transition-colors placeholder:text-muted hover:border-brand-500 focus:border-brand-600"
      />
      <button
        type="submit"
        aria-label="Search"
        data-testid={`${testPrefix}-submit`}
        className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-brand-600"
      >
        <Search size={17} aria-hidden />
      </button>
    </form>
  );
}
