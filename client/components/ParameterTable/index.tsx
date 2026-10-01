import { PropertyTable, type TableLabels } from '@/components/PropertyTable';
import type { DocParameter } from '@/lib/docs';

interface ParameterTableProps {
    parameters: readonly DocParameter[];
    labels: TableLabels;
}

export function ParameterTable({ parameters, labels }: ParameterTableProps) {
    return <PropertyTable fields={parameters} labels={labels} />;
}
