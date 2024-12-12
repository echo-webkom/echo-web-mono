import {
	Atom,
	Briefcase,
	Building2,
	CalendarDays,
	CircleDollarSign,
	GraduationCap,
	Heart,
	HeartHandshake,
	MailOpen,
	Martini,
	Megaphone,
	Presentation,
	Scale,
	ScrollText,
	ShoppingCart,
	StickyNote,
	Users,
	Wallet
} from 'lucide-svelte';

type Route =
	| {
			label: string;
			href: string;
	  }
	| {
			label: string;
			links: Array<{
				label: string;
				href: string;
				description: string;
				Icon: typeof CalendarDays;
			}>;
	  };

export const headerRoutes: Array<Route> = [
	{
		label: 'Hjem',
		href: '/'
	},
	{
		label: 'For studenter',
		links: [
			{
				label: 'Arrangementer',
				href: '/for-studenter/arrangementer',
				description: 'Oversikt over kommende og tidligere arrangementer',
				Icon: CalendarDays
			},
			{
				label: 'Jobber',
				href: '/for-studenter/jobber',
				description: 'Se hvilke jobber som er tilgjengelig for studenter',
				Icon: CircleDollarSign
			},
			{
				label: 'Innlegg',
				href: '/for-studenter/innlegg',
				description: 'Nyheter og oppdateringer fra echo',
				Icon: MailOpen
			},
			{
				label: 'Hovedstyre',
				href: '/for-studenter/grupper/hovedstyre',
				description: 'Oversikt over hovedstyret',
				Icon: Users
			},
			{
				label: 'Undergrupper',
				href: '/for-studenter/grupper/undergrupper',
				description: 'Oversikt over undergrupper',
				Icon: Users
			},
			{
				label: 'Programmerbar',
				href: 'https://programmer.bar',
				description: 'Studentbaren for informatikkstudenter',
				Icon: Martini
			},
			{
				label: 'Interessegrupper',
				href: '/for-studenter/grupper/interessegrupper',
				description: 'Oversikt over interessegrupper',
				Icon: Users
			},
			{
				label: 'Idrettslag',
				href: '/for-studenter/grupper/idrettslag',
				description: 'Oversikt over idrettslag',
				Icon: Users
			},
			{
				label: 'Møtereferater',
				href: '/for-studenter/motereferater',
				description: 'Referater fra møter og generalforsamlinger i echo',
				Icon: ScrollText
			},
			{
				label: 'Masterinfo',
				href: '/for-studenter/masterinfo',
				description: 'Informasjon til deg som tar master',
				Icon: GraduationCap
			},
			{
				label: 'Økonomisk støtte',
				href: '/for-studenter/okonomisk-stotte',
				description: 'Økonmisk støtte for arrangementer og aktiviteter',
				Icon: CircleDollarSign
			},
			{
				label: 'Anonyme tilbakemeldinger',
				href: '/for-studenter/anonyme-tilbakemeldinger',
				description: 'Send anonyme tilbakemeldinger',
				Icon: Megaphone
			},
			{
				label: 'Hyggkoms handleliste',
				href: '/for-studenter/handleliste',
				description: 'Si hva du synes hyggkom burde kjøpe inn til lesesalen',
				Icon: ShoppingCart
			},
			{
				label: 'Utlegg',
				href: '/for-studenter/utlegg',
				description: 'Sende inn faktura og utlegg',
				Icon: Wallet
			},
			{
				label: 'Speak Up',
				href: '/for-studenter/speak-up',
				description: 'Opplevd noe kjipt? Speak Up!',
				Icon: Heart
			}
		]
	},
	{
		label: 'For bedrifter',
		links: [
			{
				label: 'Bedriftspresentasjon',
				href: '/for-bedrifter/bedriftspresentasjon',
				description: 'Ønsker du å presentere bedriften din?',
				Icon: Presentation
			},
			{
				label: 'Stillingsannonser',
				href: '/for-bedrifter/stillingsutlysninger',
				description: 'Informasjon om stillingsutlysninger på våre nettsider',
				Icon: Briefcase
			}
		]
	},
	{
		label: 'Om echo',
		links: [
			{
				label: 'Om oss',
				href: '/om/echo',
				description: 'Om echo',
				Icon: Atom
			},
			{
				label: 'Instituttrådet',
				href: '/om/instituttradet',
				description: 'Om instituttrådet',
				Icon: Building2
			},
			{
				label: 'Vedtekter',
				href: '/om/vedtekter',
				description: 'Vedtekter',
				Icon: Scale
			},
			{
				label: 'Bekk',
				href: '/om/bekk',
				description: 'Om Bekk, vår samarbeidspartner',
				Icon: HeartHandshake
			},
			{
				label: 'Brosjyre',
				href: '/om/brosjyre',
				description: 'Brosjyre med informasjon om echo',
				Icon: StickyNote
			},
			{
				label: 'Programstyrene',
				href: '/om/programstyrene',
				description: 'Oversikt over programstyrene',
				Icon: Users
			},
			{
				label: 'Etiske retningslinjer',
				href: '/om/retningslinjer',
				description: 'Oversikt over etiske retningslinjer',
				Icon: Scale
			}
		]
	}
];
