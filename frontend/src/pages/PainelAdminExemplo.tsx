import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Bus,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileText,
  File,
  Info,
  LayoutDashboard,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Star,
  Users,
  XCircle,
  Upload,
} from "lucide-react";

type NavItem = {
  id: SectionId;
  label: string;
  icon: typeof LayoutDashboard;
  count?: number;
};

type SectionId =
  | "overview"
  | "prestadores"
  | "documentos"
  | "vans"
  | "avaliacoes"
  | "habilitacao";

type StatusType =
  | "all"
  | "pendente"
  | "aprovado"
  | "reprovado"
  | "correcao";

type Prestador = {
  id: string;
  initials: string;
  name: string;
  meta: string;
  phone: string;
  verified: boolean;
  docsText: string;
  status: StatusType;
  statusLabel: string;
  badgeVariant: string;
  avatarColor: string;
};

type DocumentRow = {
  id: string;
  name: string;
  document: string;
  date: string;
  status: StatusType;
  statusLabel: string;
  badgeVariant: string;
  actions: string[];
};

type ModalType = "doc" | "reject" | "correction" | "resubmit" | null;

type DocModal = {
  id: string;
  name: string;
  document: string;
  date: string;
  status: StatusType;
  statusLabel: string;
  badgeVariant: string;
};

const navItems: NavItem[] = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "prestadores", label: "Prestadores", icon: Users, count: 24 },
  { id: "documentos", label: "Documentos", icon: FileCheck, count: 7 },
  { id: "vans", label: "Rotas e vans", icon: Bus },
  { id: "avaliacoes", label: "Avaliações", icon: Star },
  { id: "habilitacao", label: "Minha habilitação", icon: ShieldCheck },
];

const statCards = [
  {
    label: "Prestadores",
    value: "24",
    sub: "↑ 3 este mês",
    icon: Users,
    iconBg: "bg-purple-100 text-purple-600",
  },
  {
    label: "Docs. pendentes",
    value: "7",
    sub: "Aguardando análise",
    icon: Clock,
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    label: "Aprovados",
    value: "15",
    sub: "Prestadores ativos",
    icon: CheckCircle2,
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Reprovados",
    value: "2",
    sub: "Requer ação",
    icon: XCircle,
    iconBg: "bg-rose-100 text-rose-600",
  },
];

const providerRows: Prestador[] = [
  {
    id: "carlos",
    initials: "CM",
    name: "Carlos Mendes",
    meta: "carlos@email.com",
    phone: "(42) 99812-3456",
    verified: true,
    docsText: "3/5",
    status: "pendente",
    statusLabel: "Pendente",
    badgeVariant: "bg-amber-100 text-amber-800",
    avatarColor: "bg-purple-100 text-purple-600",
  },
  {
    id: "fernanda",
    initials: "FC",
    name: "Fernanda Costa",
    meta: "fer.costa@email.com",
    phone: "(42) 98765-4321",
    verified: true,
    docsText: "5/5",
    status: "pendente",
    statusLabel: "Em análise",
    badgeVariant: "bg-amber-100 text-amber-800",
    avatarColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "joao",
    initials: "JO",
    name: "João Oliveira",
    meta: "joao.oli@email.com",
    phone: "(42) 99111-2233",
    verified: true,
    docsText: "5/5 ✓",
    status: "aprovado",
    statusLabel: "Aprovado",
    badgeVariant: "bg-emerald-100 text-emerald-700",
    avatarColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "paulo",
    initials: "PL",
    name: "Paulo Lima",
    meta: "03/05/2025",
    phone: "(42) 98000-5544",
    verified: false,
    docsText: "2 reprovados",
    status: "reprovado",
    statusLabel: "Reprovado",
    badgeVariant: "bg-rose-100 text-rose-700",
    avatarColor: "bg-rose-100 text-rose-700",
  },
  {
    id: "ana",
    initials: "AS",
    name: "Ana Souza",
    meta: "01/05/2025",
    phone: "(42) 97654-3210",
    verified: true,
    docsText: "correção sol.",
    status: "correcao",
    statusLabel: "Correção sol.",
    badgeVariant: "bg-sky-100 text-sky-700",
    avatarColor: "bg-sky-100 text-sky-700",
  },
];

const overviewDocs = [
  {
    id: "doc1",
    icon: FileText,
    title: "CNH — Carlos Mendes",
    subtitle: "Enviado há 2 horas",
    status: "pendente",
    statusLabel: "Pendente",
    badgeVariant: "bg-amber-100 text-amber-800",
  },
  {
    id: "doc2",
    icon: Bus,
    title: "CRLV — Fernanda Costa",
    subtitle: "Enviado há 5 horas",
    status: "pendente",
    statusLabel: "Pendente",
    badgeVariant: "bg-amber-100 text-amber-800",
  },
  {
    id: "doc3",
    icon: FileCheck,
    title: "Laudo técnico — Paulo Lima",
    subtitle: "Enviado ontem",
    status: "pendente",
    statusLabel: "Pendente",
    badgeVariant: "bg-amber-100 text-amber-800",
  },
];

const latestProviders = [
  {
    id: "provider1",
    name: "Carlos Mendes",
    email: "carlos@email.com",
    date: "15/05/2025",
    docs: "3/5 enviados",
    status: "pendente",
    badgeVariant: "bg-amber-100 text-amber-800",
  },
  {
    id: "provider2",
    name: "Fernanda Costa",
    email: "fer.costa@email.com",
    date: "12/05/2025",
    docs: "5/5 enviados",
    status: "pendente",
    badgeVariant: "bg-amber-100 text-amber-800",
  },
  {
    id: "provider3",
    name: "João Oliveira",
    email: "joao.oli@email.com",
    date: "08/05/2025",
    docs: "5/5 aprovados",
    status: "aprovado",
    badgeVariant: "bg-emerald-100 text-emerald-700",
  },
];

const documentRows: DocumentRow[] = [
  {
    id: "doca",
    name: "Carlos Mendes",
    document: "CNH",
    date: "15/05/2025",
    status: "pendente",
    statusLabel: "Pendente",
    badgeVariant: "bg-amber-100 text-amber-800",
    actions: ["view", "approve", "reject", "correction"],
  },
  {
    id: "docb",
    name: "Carlos Mendes",
    document: "CRLV",
    date: "15/05/2025",
    status: "aprovado",
    statusLabel: "Aprovado",
    badgeVariant: "bg-emerald-100 text-emerald-700",
    actions: ["view"],
  },
  {
    id: "docc",
    name: "Fernanda Costa",
    document: "CNH",
    date: "12/05/2025",
    status: "pendente",
    statusLabel: "Pendente",
    badgeVariant: "bg-amber-100 text-amber-800",
    actions: ["view", "approve", "reject", "correction"],
  },
  {
    id: "docd",
    name: "Paulo Lima",
    document: "Laudo técnico",
    date: "03/05/2025",
    status: "reprovado",
    statusLabel: "Reprovado",
    badgeVariant: "bg-rose-100 text-rose-700",
    actions: ["view", "approve"],
  },
  {
    id: "doce",
    name: "Ana Souza",
    document: "CRLV",
    date: "01/05/2025",
    status: "correcao",
    statusLabel: "Correção sol.",
    badgeVariant: "bg-sky-100 text-sky-700",
    actions: ["view", "approve"],
  },
  {
    id: "docf",
    name: "João Oliveira",
    document: "Antecedentes",
    date: "08/05/2025",
    status: "aprovado",
    statusLabel: "Aprovado",
    badgeVariant: "bg-emerald-100 text-emerald-700",
    actions: ["view"],
  },
];

const habilitacaoSteps = [
  {
    title: "E-mail verificado",
    description: "Link de confirmação enviado e validado",
    variant: "done",
    badge: "Concluído",
    badgeClass: "bg-emerald-100 text-emerald-700",
    icon: Check,
  },
  {
    title: "Documentos enviados",
    description: "CNH, CRLV, laudo técnico e antecedentes enviados",
    variant: "done",
    badge: "Concluído",
    badgeClass: "bg-emerald-100 text-emerald-700",
    icon: Check,
  },
  {
    title: "Documentos aprovados",
    description: "Aguardando análise da administração — prazo de até 48h",
    variant: "pending",
    badge: "Em análise",
    badgeClass: "bg-amber-100 text-amber-800",
    icon: Clock,
  },
  {
    title: "Perfil 100% validado",
    description: "Disponível após aprovação dos documentos",
    variant: "blocked",
    badge: "Bloqueado",
    badgeClass: "bg-slate-100 text-slate-500",
    icon: ShieldCheck,
  },
];

const habilitacaoDocs = [
  {
    id: "h1",
    icon: FileCheck,
    title: "CNH — Carteira Nacional de Habilitação",
    subtitle: "Enviado em 15/05/2025",
    statusLabel: "Em análise",
    badgeClass: "bg-amber-100 text-amber-800",
  },
  {
    id: "h2",
    icon: Bus,
    title: "CRLV — Certificado de Registro do Veículo",
    subtitle: "Enviado em 15/05/2025",
    statusLabel: "Aprovado",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "h3",
    icon: FileText,
    title: "Laudo técnico do veículo",
    subtitle: "Enviado em 14/05/2025",
    statusLabel: "Correção solicitada",
    badgeClass: "bg-sky-100 text-sky-700",
  },
  {
    id: "h4",
    icon: FileText,
    title: "Certidão de antecedentes criminais",
    subtitle: "Enviado em 13/05/2025",
    statusLabel: "Aprovado",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
];

const statusPill = (status: StatusType) => {
  switch (status) {
    case "aprovado":
      return "bg-emerald-100 text-emerald-700";
    case "reprovado":
      return "bg-rose-100 text-rose-700";
    case "correcao":
      return "bg-sky-100 text-sky-700";
    default:
      return "bg-amber-100 text-amber-800";
  }
};

const sectionTitle: Record<SectionId, string> = {
  overview: "Visão geral",
  prestadores: "Prestadores",
  documentos: "Documentos",
  vans: "Rotas e vans",
  avaliacoes: "Avaliações",
  habilitacao: "Minha habilitação",
};

const PainelAdminExemplo = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [prestadorFilter, setPrestadorFilter] = useState<StatusType>("all");
  const [documentFilter, setDocumentFilter] = useState<StatusType>("all");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocModal | null>(null);
  const [documents, setDocuments] = useState<DocumentRow[]>(documentRows);
  const [modalTargetId, setModalTargetId] = useState<string | null>(null);

  const activeNav = navItems.find((item) => item.id === activeSection);

  const filteredPrestadores = useMemo(() => {
    if (prestadorFilter === "all") return providerRows;
    return providerRows.filter((item) => item.status === prestadorFilter);
  }, [prestadorFilter]);

  const filteredDocuments = useMemo(() => {
    if (documentFilter === "all") return documents;
    return documents.filter((item) => item.status === documentFilter);
  }, [documentFilter, documents]);

  const openDocModal = (doc: DocumentRow) => {
    setSelectedDoc({
      id: doc.id,
      name: doc.name,
      document: doc.document,
      date: doc.date,
      status: doc.status,
      statusLabel: doc.statusLabel,
      badgeVariant: doc.badgeVariant,
    });
    setModalType("doc");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedDoc(null);
    setModalTargetId(null);
  };

  const changeStatus = (id: string, newStatus: StatusType) => {
    setDocuments((current) =>
      current.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status: newStatus,
              statusLabel:
                newStatus === "aprovado"
                  ? "Aprovado"
                  : newStatus === "reprovado"
                  ? "Reprovado"
                  : newStatus === "correcao"
                  ? "Correção sol."
                  : "Pendente",
              badgeVariant: statusPill(newStatus),
              actions:
                newStatus === "aprovado"
                  ? ["view"]
                  : newStatus === "reprovado"
                  ? ["view"]
                  : newStatus === "correcao"
                  ? ["view"]
                  : ["view", "approve", "reject", "correction"],
            }
          : doc,
      ),
    );
  };

  const confirmAction = (newStatus: StatusType) => {
    if (!modalTargetId) return;
    changeStatus(modalTargetId, newStatus);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-72 shrink-0 border-r border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="text-2xl font-semibold text-purple-600">PBTE</div>
            <div className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">
              Painel Administrativo
            </div>
          </div>

          <div className="space-y-1 px-3 py-4">
            <div className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Gestão
            </div>
            {navItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={
                    `flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition ` +
                    (active
                      ? "bg-purple-50 text-purple-700"
                      : "text-slate-600 hover:bg-slate-100")
                  }
                >
                  <Icon className={active ? "h-5 w-5 text-purple-600" : "h-5 w-5 text-slate-400"} />
                  <span>{item.label}</span>
                  {item.count ? (
                    <span className="ml-auto rounded-full bg-purple-600 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}

            <div className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Plataforma
            </div>
            {navItems.slice(3, 5).map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={
                    `flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition ` +
                    (active
                      ? "bg-purple-50 text-purple-700"
                      : "text-slate-600 hover:bg-slate-100")
                  }
                >
                  <Icon className={active ? "h-5 w-5 text-purple-600" : "h-5 w-5 text-slate-400"} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Prestador
            </div>
            {navItems.slice(5).map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={
                    `flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition ` +
                    (active
                      ? "bg-purple-50 text-purple-700"
                      : "text-slate-600 hover:bg-slate-100")
                  }
                >
                  <Icon className={active ? "h-5 w-5 text-purple-600" : "h-5 w-5 text-slate-400"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto border-t border-slate-200 px-4 py-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-semibold">
                AD
              </div>
              <div>
                <div className="text-sm font-semibold">Admin</div>
                <div className="text-xs text-slate-500">admin@pbte.com.br</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
            <div className="text-base font-semibold">{sectionTitle[activeSection]}</div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
              >
                <Bell className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <section className={activeSection !== "overview" ? "hidden" : "space-y-6"}>
              <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-1">
                {statCards.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl ${stat.iconBg}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{stat.label}</div>
                      <div className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</div>
                      <div className="mt-2 text-sm text-slate-500">{stat.sub}</div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-semibold text-slate-900">Documentos aguardando análise</div>
                    <button
                      type="button"
                      onClick={() => setActiveSection("documentos")}
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      Ver todos
                    </button>
                  </div>
                  <div className="space-y-2 p-5">
                    {overviewDocs.map((doc) => {
                      const Icon = doc.icon;
                      return (
                        <div key={doc.id} className="flex flex-col gap-3 rounded-3xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-purple-100 text-purple-600">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{doc.title}</div>
                              <div className="text-sm text-slate-500">{doc.subtitle}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${doc.badgeVariant}`}>
                              <Clock className="mr-1 h-3.5 w-3.5" />
                              {doc.statusLabel}
                            </span>
                            <button
                              type="button"
                              onClick={() => openDocModal({
                                id: doc.id,
                                name: doc.title.split(" — ")[1] || "",
                                document: doc.title.split(" — ")[0],
                                date: doc.subtitle,
                                status: doc.status,
                                statusLabel: doc.statusLabel,
                                badgeVariant: doc.badgeVariant,
                              })}
                              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                              <Eye className="h-4 w-4" />
                              Analisar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 p-5">
                    <div className="text-sm font-semibold text-slate-900">Últimos prestadores cadastrados</div>
                  </div>
                  <div className="overflow-x-auto p-5">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Prestador</th>
                          <th className="px-4 py-3">Cadastro</th>
                          <th className="px-4 py-3">Documentos</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {latestProviders.map((provider) => (
                          <tr key={provider.id} className="hover:bg-slate-50">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${provider.badgeVariant.replace("text-","text-").replace("bg-", "bg-")}`}>
                                  {provider.initials}
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900">{provider.name}</div>
                                  <div className="text-sm text-slate-500">{provider.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-slate-600">{provider.date}</td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${provider.badgeVariant}`}>
                                {provider.docs}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${provider.badgeVariant}`}>
                                {provider.statusLabel}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            <section className={activeSection !== "prestadores" ? "hidden" : "space-y-6"}>
              <div className="flex flex-wrap gap-3">
                {["all", "pendente", "aprovado", "reprovado"].map((filter) => {
                  const label =
                    filter === "all"
                      ? "Todos (24)"
                      : filter === "pendente"
                      ? "Pendentes (7)"
                      : filter === "aprovado"
                      ? "Aprovados (15)"
                      : "Reprovados (2)";
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setPrestadorFilter(filter as StatusType)}
                      className={
                        `rounded-full px-4 py-2 text-sm font-semibold transition ` +
                        (prestadorFilter === filter
                          ? "bg-purple-600 text-white"
                          : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50")
                      }
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-5">
                  <div className="text-sm font-semibold text-slate-900">Prestadores cadastrados</div>
                </div>
                <div className="overflow-x-auto p-5">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Prestador</th>
                        <th className="px-4 py-3">Telefone</th>
                        <th className="px-4 py-3">E-mail verif.</th>
                        <th className="px-4 py-3">Documentos</th>
                        <th className="px-4 py-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredPrestadores.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${user.avatarColor}`}>
                                {user.initials}
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">{user.name}</div>
                                <div className="text-sm text-slate-500">{user.meta}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-slate-600">{user.phone}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${user.verified ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                              {user.verified ? <Check className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                              {user.verified ? "Sim" : "Não"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.badgeVariant}`}>
                              {user.docsText}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveSection("documentos")}
                                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                              >
                                <FileText className="h-4 w-4" />
                                Docs
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                              >
                                <Users className="h-4 w-4" />
                                Perfil
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className={activeSection !== "documentos" ? "hidden" : "space-y-6"}>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "all", label: "Todos" },
                  { value: "pendente", label: "Pendentes (7)" },
                  { value: "aprovado", label: "Aprovados" },
                  { value: "reprovado", label: "Reprovados" },
                  { value: "correcao", label: "Correção solicitada" },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setDocumentFilter(filter.value as StatusType)}
                    className={
                      `rounded-full px-4 py-2 text-sm font-semibold transition ` +
                      (documentFilter === filter.value
                        ? "bg-purple-600 text-white"
                        : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50")
                    }
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-5">
                  <div className="text-sm font-semibold text-slate-900">Documentos enviados pelos prestadores</div>
                </div>
                <div className="overflow-x-auto p-5">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Prestador</th>
                        <th className="px-4 py-3">Documento</th>
                        <th className="px-4 py-3">Enviado em</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredDocuments.map((doc) => {
                        const icon =
                          doc.document === "CNH" || doc.document === "Antecedentes"
                            ? FileText
                            : doc.document === "CRLV"
                            ? Bus
                            : FileCheck;
                        const Icon = icon;
                        return (
                          <tr key={doc.id} className="hover:bg-slate-50">
                            <td className="px-4 py-4 text-slate-900">{doc.name}</td>
                            <td className="px-4 py-4 text-slate-900">
                              <div className="inline-flex items-center gap-2">
                                <Icon className="h-4 w-4 text-purple-600" />
                                {doc.document}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-slate-600">{doc.date}</td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${doc.badgeVariant}`}>
                                {doc.statusLabel}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-2">
                                {doc.actions.includes("view") ? (
                                  <button
                                    type="button"
                                    onClick={() => openDocModal(doc)}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                                  >
                                    <Eye className="h-4 w-4" />
                                    Ver
                                  </button>
                                ) : null}
                                {doc.actions.includes("approve") ? (
                                  <button
                                    type="button"
                                    onClick={() => changeStatus(doc.id, "aprovado")}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200"
                                  >
                                    <Check className="h-4 w-4" />
                                    Aprovar
                                  </button>
                                ) : null}
                                {doc.actions.includes("reject") ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setModalTargetId(doc.id);
                                      setModalType("reject");
                                    }}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Recusar
                                  </button>
                                ) : null}
                                {doc.actions.includes("correction") ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setModalTargetId(doc.id);
                                      setModalType("correction");
                                    }}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-100 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-200"
                                  >
                                    <RefreshCcw className="h-4 w-4" />
                                  </button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className={activeSection !== "vans" ? "hidden" : "space-y-6"}>
              <div className="rounded-3xl border border-slate-200 bg-white p-20 text-center text-slate-500 shadow-sm">
                <Bus className="mx-auto mb-4 h-10 w-10 text-purple-600" />
                <div className="text-lg font-semibold text-slate-900">Gestão de rotas e vans</div>
                <div className="mt-2 text-sm">Seção em construção — aqui ficarão todas as rotas ativas da plataforma.</div>
              </div>
            </section>

            <section className={activeSection !== "avaliacoes" ? "hidden" : "space-y-6"}>
              <div className="rounded-3xl border border-slate-200 bg-white p-20 text-center text-slate-500 shadow-sm">
                <Star className="mx-auto mb-4 h-10 w-10 text-purple-600" />
                <div className="text-lg font-semibold text-slate-900">Moderação de avaliações</div>
                <div className="mt-2 text-sm">Seção em construção — moderação de avaliações dos usuários.</div>
              </div>
            </section>

            <section className={activeSection !== "habilitacao" ? "hidden" : "space-y-6"}>
              <div className="max-w-3xl space-y-6">
                <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 text-sm text-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-1 h-5 w-5" />
                    <div>
                      <div className="font-semibold">Conta ainda não habilitada</div>
                      <div>Complete todas as etapas abaixo para poder criar rotas na plataforma.</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-semibold text-slate-900">Progresso de habilitação</div>
                    <div className="text-sm font-semibold text-purple-600">3 de 5 etapas</div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Progresso geral</span>
                      <span className="font-semibold text-purple-600">60%</span>
                    </div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-2.5 w-3/5 bg-purple-600" />
                    </div>
                    <div className="mt-6 space-y-4">
                      {habilitacaoSteps.map((step) => {
                        const Icon = step.icon;
                        return (
                          <div key={step.title} className="flex items-start gap-4 rounded-3xl border border-slate-200 p-4">
                            <div
                              className={`mt-1 flex h-10 w-10 items-center justify-center rounded-2xl ${
                                step.variant === "done"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : step.variant === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-slate-900">{step.title}</div>
                              <div className="text-sm text-slate-500">{step.description}</div>
                            </div>
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${step.badgeClass}`}>
                              {step.badge}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 p-5">
                    <div className="text-sm font-semibold text-slate-900">Meus documentos</div>
                  </div>
                  <div className="space-y-3 p-5">
                    {habilitacaoDocs.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-purple-600">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{item.title}</div>
                              <div className="text-sm text-slate-500">{item.subtitle}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-start gap-2 sm:items-end">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.badgeClass}`}>
                              {item.statusLabel}
                            </span>
                            {item.id === "h3" ? (
                              <button
                                type="button"
                                onClick={() => setModalType("resubmit")}
                                className="inline-flex items-center gap-2 rounded-2xl bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-200"
                              >
                                <Upload className="h-4 w-4" />
                                Reenviar
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-sky-50 p-5 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <Info className="mt-1 h-5 w-5 text-sky-700" />
                    <div>
                      <div className="font-semibold text-slate-900">Atenção — laudo técnico pendente de reenvio</div>
                      <div>A administração solicitou correção do laudo técnico. Reenvie o documento atualizado para prosseguir com a habilitação.</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {(modalType === "doc" || modalType === "reject" || modalType === "correction" || modalType === "resubmit") && (
        <div
          onClick={(event) => {
            if (event.currentTarget === event.target) closeModal();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            {modalType === "doc" ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-200 p-5">
                  <div>
                    <div className="text-base font-semibold text-slate-900">Analisar documento</div>
                    <div className="mt-1 text-sm text-slate-500">Prestador: {selectedDoc?.name}</div>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-100 text-purple-600">
                      <FileText className="h-10 w-10" />
                    </div>
                    <div className="text-lg font-semibold text-slate-900">{selectedDoc?.document || "documento.pdf"}</div>
                    <p className="mt-3 text-sm text-slate-500">Pré-visualização do arquivo enviado pelo prestador</p>
                    <button
                      type="button"
                      className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                    >
                      <Download className="h-4 w-4" />
                      Baixar documento
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Tipo de documento</div>
                        <div className="mt-2 text-sm font-semibold text-slate-900">{selectedDoc?.document}</div>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Enviado em</div>
                        <div className="mt-2 text-sm font-semibold text-slate-900">{selectedDoc?.date}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Observação (opcional)</div>
                      <textarea
                        rows={3}
                        className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        placeholder="Adicione uma observação ao analisar este documento..."
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Solicitar correção
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmAction("reprovado")}
                    className="inline-flex items-center gap-2 rounded-2xl bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                  >
                    <XCircle className="h-4 w-4" />
                    Recusar
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmAction("aprovado")}
                    className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    <Check className="h-4 w-4" />
                    Aprovar documento
                  </button>
                </div>
              </>
            ) : modalType === "reject" ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-200 p-5">
                  <div className="text-base font-semibold text-slate-900">Recusar documento</div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4 p-5">
                  <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-1 h-5 w-5" />
                      <div>O prestador será notificado por e-mail sobre a recusa.</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Motivo da recusa <span className="text-rose-600">*</span></div>
                    <textarea
                      rows={4}
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      placeholder="Descreva claramente o motivo para que o prestador possa tomar as ações necessárias..."
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmAction("reprovado")}
                    className="inline-flex rounded-2xl bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                  >
                    Confirmar recusa
                  </button>
                </div>
              </>
            ) : modalType === "correction" ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-200 p-5">
                  <div className="text-base font-semibold text-slate-900">Solicitar correção</div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4 p-5">
                  <div className="rounded-3xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-700">
                    <div className="flex items-start gap-3">
                      <Info className="mt-1 h-5 w-5" />
                      <div>O prestador receberá uma notificação solicitando o reenvio do documento corrigido.</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">O que precisa ser corrigido? <span className="text-rose-600">*</span></div>
                    <textarea
                      rows={4}
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      placeholder="Ex: Documento com data vencida. Por favor, reenvie a versão atualizada..."
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmAction("correcao")}
                    className="inline-flex rounded-2xl bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-200"
                  >
                    Enviar solicitação
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-200 p-5">
                  <div className="text-base font-semibold text-slate-900">Reenviar laudo técnico</div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4 p-5">
                  <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-1 h-5 w-5" />
                      <div>
                        <strong>Motivo da correção:</strong> Documento com data vencida. Por favor, reenvie a versão atualizada com validade dentro do prazo.
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                    <Upload className="mx-auto mb-4 h-10 w-10 text-purple-600" />
                    <div className="text-sm font-semibold text-slate-900">Clique para selecionar o arquivo</div>
                    <div className="mt-2 text-xs">PDF, JPG ou PNG — máximo 10 MB</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    <Upload className="h-4 w-4" />
                    Enviar para análise
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PainelAdminExemplo;
