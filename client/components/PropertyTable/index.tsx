import { RichText } from '@/components/RichText';
import type { DocField } from '@/lib/docs';

interface PropertyTableProps {
    fields: readonly DocField[];
    nameLabel?: string;
}

export function PropertyTable({ fields, nameLabel = 'Key' }: PropertyTableProps) {
    return (
        <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[34rem] text-left text-sm">
                <thead className="bg-surface text-xs text-subtle">
                    <tr>
                        <th scope="col" className="px-4 py-2.5 font-medium">
                            {nameLabel}
                        </th>
                        <th scope="col" className="px-4 py-2.5 font-medium">
                            Type
                        </th>
                        <th scope="col" className="px-4 py-2.5 font-medium">
                            Description
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
                            <td className="px-4 py-2.5 leading-relaxed text-muted">
                                <RichText text={field.description} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
