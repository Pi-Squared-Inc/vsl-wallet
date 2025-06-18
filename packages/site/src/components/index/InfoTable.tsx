import React, { useState } from 'react';
import { MdContentCopy, MdCheck } from 'react-icons/md';
import type { Json } from '@metamask/utils';
import { RawTextArea } from '../RawTextArea';

export type InfoCell =
  | { type: 'text'; data: string, rawData?: string }
  | { type: 'mono'; data: string, rawData?: string }
  | { type: 'chips'; data: string[] }
  | { type: 'table'; data: Record<string, InfoRow> }
  | { type: 'raw'; data: Json }

export type RowMeta = {
  rawKey?: string;
  keyType?: 'mono' | 'text';
};

export type InfoRow = RowMeta & InfoCell;

type GenericTableProps = {
  data: Record<string, InfoRow>;
  collapseThreshold?: number;
  showHeader?: boolean;
};

const BaseTable: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <table className="w-full text-left border-collapse">{children}</table>
);

const TableHeader: React.FC = () => (
  <thead>
    <tr className="border-b border-gray-600">
      <th className="py-2 pr-3 text-gray-300 font-[550]">Field</th>
      <th className="py-2 pr-3 text-gray-300 font-[550]">Value</th>
    </tr>
  </thead>
);

const ChipList: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((item) => (
      <span
        key={item}
        className="
        inline-block px-2.5 py-1 text-sm bg-violet-700 text-gray-200 hover rounded-full
        border-[2.5] border-violet-700 hover:bg-black font-[500] hover:text-white
        transition-colors duration-200
      ">
        {item}
      </span>
    ))}
  </div>
);

const MonoTextWithCopy: React.FC<{ text: string; raw?: string; isKey?: boolean }> = ({ text, raw, isKey = false }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => navigator.clipboard.writeText(raw ?? text)
    .then(() => setCopied(true));

  const icon = copied
    ? <MdCheck className="text-green-400" />
    : <MdContentCopy className="text-gray-400 hover:text-white transition-colors duration-200" />;

  const txtClass = isKey
    ? 'font-iosevka text-gray-400 capitalize'
    : 'font-iosevka text-gray-200 break-all overflow-hidden';

  return (
    <div
      className="flex justify-between items-center gap-2 group w-full"
      onMouseLeave={() => {
        setTimeout(() => setCopied(false), 100)
      }}
    >
      <span className={txtClass}>{text}</span>
      <button
        onClick={copy}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 flex-shrink-0"
        aria-label="Copy"
      >
        {icon}
      </button>
    </div>
  );
};

const TableRow: React.FC<{
  label: string;
  row: InfoRow;
  isLast: boolean;
}> = ({ label, row, isLast }) => {
  const borderClass = isLast ? '' : 'border-b border-gray-600';

  const getCellClass = () => {
    switch (row.type) {
      case 'mono':
      case 'text':
      case 'chips':
        return 'py-2 pr-3 break-all align-top';
      case 'table':
        return 'p-0 align-top';
      case 'raw':
        return 'py-2 break-all align-top';
      default:
        return '';
    }
  }

  const renderValueCell = () => {
    if (row.type === 'mono') {
      return <MonoTextWithCopy text={row.data} raw={row.rawData} />;
    }

    switch (row.type) {
      case 'text':
        return <span className="text-gray-200">{row.data}</span>;
      case 'chips':
        return <ChipList items={row.data} />;
      case 'table':
        return <GenericTable data={row.data} collapseThreshold={5} showHeader={false} />;
      case 'raw':
        return (<RawTextArea value={JSON.stringify(row.data, null, 2)}/>)
      default:
        return null;
    }
  };

  const keyContent = row.keyType === 'mono'
    ? <MonoTextWithCopy text={label} isKey raw={row.rawKey}/>
    : <span className="
      group-hover:text-gray-100 transition-colors
        duration-200 text-gray-400 capitalize
        font-[500]
      ">{label}</span>;

  return (
    <tr className={`${borderClass} group`}>
      <td className={`py-2 pr-3 align-top whitespace-nowrap`}>{keyContent}</td>
      <td className={getCellClass()}>{renderValueCell()}</td>
    </tr>
  );
};

export const GenericTable: React.FC<GenericTableProps> = ({
  data,
  collapseThreshold = Infinity,
  showHeader = true,
}) => {
  const entries = Object.entries(data);
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? entries : entries.slice(0, collapseThreshold);
  const hiddenCount = entries.length - collapseThreshold;

  return (
    <div>
      <BaseTable>
        {showHeader && <TableHeader />}
        <tbody>
          {visible.map(([key, row], idx) => (
            <TableRow
              key={key}
              label={key}
              row={row}
              isLast={idx === visible.length - 1}
            />
          ))}
        </tbody>
      </BaseTable>
      {entries.length > collapseThreshold && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-sm text-purple-400 hover:text-purple-200 transition-colors duration-200"
        >
          {expanded ? 'Show less' : `Show ${hiddenCount} more`}
        </button>
      )}
    </div>
  );
};

export const InfoTable: React.FC<{ info: Record<string, InfoRow> }> = ({ info }) => (
  <div className="overflow-x-auto">
    <GenericTable data={info} collapseThreshold={Infinity} showHeader={true} />
  </div>
);
