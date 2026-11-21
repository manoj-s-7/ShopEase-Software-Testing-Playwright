import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Leaf, PackageCheck, Tag } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const VALUES = [
  { icon: Tag, title: 'Honest prices', text: 'Every discount is applied before you see the price, so the number on the card is the number you pay.' },
  { icon: PackageCheck, title: 'Straightforward shopping', text: 'Search, filter, add to cart and check out in a few clear steps, with no surprises at the end.' },
  { icon: Leaf, title: 'Fewer, better things', text: 'We favour well-rated products and a tidy catalogue over endless scrolling.' },
];

export default function AboutPage() {
  useDocumentTitle('About');
  return (
    <PageContainer narrow className="py-12 sm:py-16">
      <h1 data-testid="about-title" className="text-3xl font-bold text-ink sm:text-4xl">About ShopEase</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">
        ShopEase is a small online store built around a simple idea: shopping should feel calm. We bring together everyday essentials across beauty, home, fashion and technology, and present them clearly so you can decide quickly.
      </p>
      <p className="mt-4 leading-relaxed text-muted">
        This site is a demonstration project. Products come from a public sample catalogue and orders are stored only in your browser, so no real purchases or payments are made.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {VALUES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="rounded-2xl border border-line bg-surface p-5">
            <Icon size={20} className="text-brand-600" aria-hidden />
            <h2 className="mt-3 font-semibold text-ink">{title}</h2>
            <p className="mt-1.5 text-sm text-muted">{text}</p>
          </li>
        ))}
      </ul>
      <Button component={Link} to="/shop" variant="contained" size="large" data-testid="about-shop" sx={{ mt: 8 }}>
        Start shopping
      </Button>
    </PageContainer>
  );
}
