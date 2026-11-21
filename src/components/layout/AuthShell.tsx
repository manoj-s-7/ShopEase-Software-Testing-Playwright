import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import PageContainer from '../common/PageContainer';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

const PERKS = [
  { icon: Truck, title: 'Free delivery over $100', text: 'Orders above the threshold ship at no charge.' },
  { icon: RotateCcw, title: 'Easy returns', text: 'Change your mind? Most items can be sent back.' },
  { icon: ShieldCheck, title: 'Demo-safe checkout', text: 'No real payment details are ever collected.' },
];

export default function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <PageContainer className="py-8 sm:py-14">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-line bg-surface lg:grid-cols-[1fr_1.1fr]">
        <aside className="hidden flex-col justify-between bg-brand-900 p-10 text-white lg:flex">
          <Link to="/" className="font-display text-xl font-bold tracking-tight">
            ShopEase
          </Link>
          <ul className="space-y-6">
            {PERKS.map(({ icon: Icon, title: t, text }) => (
              <li key={t} className="flex gap-3">
                <Icon size={20} className="mt-0.5 shrink-0 text-brand-100" aria-hidden />
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="text-sm text-brand-100/80">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-sm text-brand-100/70">Considered goods for everyday life.</p>
        </aside>
        <section className="p-6 sm:p-10">
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          <p className="mt-1.5 text-sm text-muted">{subtitle}</p>
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-sm text-muted">{footer}</div>}
        </section>
      </div>
    </PageContainer>
  );
}
