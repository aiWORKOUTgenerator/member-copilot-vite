'use client';

import { AttributeFormProvider } from '@/contexts/AttributeFormContext';
import { useAttributeTypesLoading } from '@/hooks/useAttributeTypes';
import { PageLoading } from '@/ui';
import { useParams } from 'react-router';
import { AttributeForm } from '../components/AttributeForm';

export default function AttributeTypeDetail() {
  const params = useParams();
  const attributeTypeId = params?.attributeTypeId as string;
  const isAttributeTypesLoading = useAttributeTypesLoading();

  // Show loading state while checking auth status
  if (isAttributeTypesLoading) {
    return <PageLoading message="Loading attribute details..." />;
  }

  // Wrap content with AttributeFormProvider for state management
  return (
    <AttributeFormProvider>
      <AttributeForm attributeTypeId={attributeTypeId} />
    </AttributeFormProvider>
  );
}
