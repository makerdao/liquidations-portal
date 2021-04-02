type SystemStat = {
  title: string;
  format: (val: any) => string;
  minWidth?: number;
  tooltip?: string;
};

export default SystemStat;
