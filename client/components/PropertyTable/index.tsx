import { RichText } from '@/components/RichText';
import { ValueList } from '@/components/ValueList';
import type { DocField } from '@/lib/docs';

export interface TableLabels {
    name: string;
    type: string;
    description: string;
}

interface PropertyTableProps {
    fields: readonly DocField[];
    labels: TableLabels;
}

export function PropertyTable({ fields, labels }: PropertyTableProps) {
    return (
        <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[34rem] text-left text-sm">
                <thead className="bg-surface text-xs text-subtle">
                    <tr>
                        <th scope="col" className="px-4 py-2.5 font-medium">
                            {labels.name}
                        </th>
                        <th scope="col" className="px-4 py-2.5 font-medium">
                            {labels.type}
                        </th>
                        <th scope="col" className="px-4 py-2.5 font-medium">
                            {labels.description}
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {fields.map((field) => (
                        <tr key={field.name} className="align-top">
                            <td className="px-4 py-2.5 font-mono text-[13px] whitespace-nowrap text-foreground">
                                {field.name}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-[13px] whitespace-nowrap text-code-key">
                                {field.type}
                            </td>
                            <td className="space-y-2 px-4 py-2.5 leading-relaxed text-muted">
                                <p>
                                    <RichText text={field.description} />
                                </p>
                                {field.values ? <ValueList values={field.values} /> : null}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
