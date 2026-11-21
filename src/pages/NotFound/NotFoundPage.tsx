import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Compass } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PageContainer from '../../components/common/PageContainer';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <PageContainer className="py-20">
      <EmptyState testId="not-found" icon={Compass} title="Page not found" description="The page you are looking for does not exist or has moved.">
        <Button component={Link} to="/" variant="contained" data-testid="not-found-home">
          Back to home
        </Button>
        <Button component={Link} to="/shop" variant="outlined">
          Browse the shop
        </Button>
      </EmptyState>
    </PageContainer>
  );
}
