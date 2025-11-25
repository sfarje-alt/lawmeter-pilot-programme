import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, Clock, AlertTriangle, FileText } from 'lucide-react';
import { Certificate } from '@/types/certificates';

interface SummaryCardsProps {
  certificates: Certificate[];
}

export function SummaryCards({ certificates }: SummaryCardsProps) {
  const total = certificates.length;
  const valid = certificates.filter(c => c.status === 'Valid').length;
  const expiringSoon = certificates.filter(c => c.status === 'Expiring Soon').length;
  const expired = certificates.filter(c => c.status === 'Expired').length;

  const cards = [
    {
      title: 'Total Certificates',
      value: total,
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Valid',
      value: valid,
      icon: FileCheck,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Expiring Soon',
      value: expiringSoon,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Expired',
      value: expired,
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card) => (
        <Card key={card.title} className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
