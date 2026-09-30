import { tableFeatures } from '@tanstack/react-table';

// ponytail: these tables never sort, filter or paginate, so no features to register
export const features = tableFeatures({});
