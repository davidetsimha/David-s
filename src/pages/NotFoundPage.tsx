import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../config/routes';
import { Button } from '../components/ui';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-burgundy-600">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          {t('notFound.title', 'Page non trouvee')}
        </h2>
        <p className="mt-2 text-gray-600">
          {t('notFound.message', 'La page que vous recherchez n\'existe pas.')}
        </p>
        <Link to={ROUTES.HOME} className="mt-8 inline-block">
          <Button variant="primary">
            {t('notFound.backHome', 'Retour a l\'accueil')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
