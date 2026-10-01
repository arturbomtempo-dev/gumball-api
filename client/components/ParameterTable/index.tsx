import { RichText } from '@/components/RichText';
import type { DocParameter } from '@/lib/docs';

interface ParameterTableProps {
    parameters: readonly DocParameter[];
}

export function ParameterTable({ parameters }: ParameterTableProps) {
    return (
        <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[34rem] text-left text-sm">
                <thead className="bg-surface text-xs text-subtle">
                    <tr>
                        <th scope="col" className="px-4 py-2.5 font-medium">
                            Parameter
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
                    {parameters.map((parameter) => (
                        <tr key={parameter.name} className="align-top">
                            <td className="px-4 py-2.5 font-mono text-[13px] whitespace-nowrap text-foreground">
                                {parameter.name}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-[13px] whitespace-nowrap text-code-key">
                                {parameter.type}
                            </td>
                            <td className="space-y-2 px-4 py-2.5 leading-relaxed text-muted">
                                <p>
                                    <RichText text={parameter.description} />
                                </p>
                                {parameter.values ? (
                                    <ul className="flex flex-wrap gap-1.5">
                                        {parameter.values.map((value) => (
                                            <li
                                                key={value}
                                                className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground"
                                            >
                                                {value}
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
