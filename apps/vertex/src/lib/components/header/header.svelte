<script lang="ts">
	import Logo from '$lib/assets/images/echo-logo.png';
	import { setHeaderContext } from '$lib/context/header';
	import HeaderButton from './header-button.svelte';
	import HeaderLink from './header-link.svelte';
	import HeaderDropdown from './header-dropdown.svelte';
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
		Shirt,
		ShoppingCart,
		StickyNote,
		Users,
		Wallet
	} from '@lucide/svelte';

	let context = $state({
		routes: []
	});

	setHeaderContext(context);
</script>

<div class="border-b relative">
	<header class="flex items-center mx-auto max-w-7xl justify-between p-4">
		<div class="flex items-center gap-8">
			<img src={Logo} class="size-14" alt="echo Logo" />

			<menu class="flex gap-4 items-center">
				<HeaderLink href="/">Hjem</HeaderLink>
				<HeaderButton
					links={[
						{
							label: 'Arrangementer',
							href: '/for-studenter/arrangementer',
							description: 'Oversikt over kommende og tidligere arrangementer',
							icon: CalendarDays
						},
						{
							label: 'Stillingsannonser',
							href: '/for-studenter/stillingsannonser',
							description: 'Se hvilke stillingsannonsener som er tilgjengelig for studenter',
							icon: CircleDollarSign
						},
						{
							label: 'Innlegg',
							href: '/for-studenter/innlegg',
							description: 'Nyheter og oppdateringer fra echo',
							icon: MailOpen
						},
						{
							label: 'Hovedstyrer',
							href: '/for-studenter/grupper/hovedstyre',
							description: 'Oversikt over echos hovedstyrer',
							icon: Users
						},
						{
							label: 'Undergrupper',
							href: '/for-studenter/grupper/undergrupper',
							description: 'Oversikt over undergrupper',
							icon: Users
						},
						{
							label: 'Programmerbar',
							href: 'https://programmer.bar',
							description: 'Studentbaren for informatikkstudenter',
							icon: Martini
						},
						{
							label: 'Interessegrupper',
							href: '/for-studenter/grupper/interessegrupper',
							description: 'Oversikt over interessegrupper',
							icon: Users
						},
						{
							label: 'Idrettslag',
							href: '/for-studenter/grupper/idrettslag',
							description: 'Oversikt over idrettslag',
							icon: Users
						},
						{
							label: 'Møtereferater',
							href: '/for-studenter/motereferater',
							description: 'Referater fra møter og generalforsamlinger i echo',
							icon: ScrollText
						},
						{
							label: 'Masterinfo',
							href: '/for-studenter/masterinfo',
							description: 'Informasjon til deg som tar master',
							icon: GraduationCap
						},
						{
							label: 'Økonomisk støtte',
							href: '/for-studenter/okonomisk-stotte',
							description: 'Økonmisk støtte for arrangementer og aktiviteter',
							icon: CircleDollarSign
						},
						{
							label: 'Anonyme tilbakemeldinger',
							href: '/for-studenter/anonyme-tilbakemeldinger',
							description: 'Send anonyme tilbakemeldinger',
							icon: Megaphone
						},
						{
							label: 'Hyggkoms handleliste',
							href: '/for-studenter/handleliste',
							description: 'Si hva du synes hyggkom burde kjøpe inn til lesesalen',
							icon: ShoppingCart
						},
						{
							label: 'Merch',
							href: '/for-studenter/merch',
							description: 'Få deg noe tøff echo merch',
							icon: Shirt
						},
						{
							label: 'Utlegg',
							href: '/for-studenter/utlegg',
							description: 'Sende inn faktura og utlegg',
							icon: Wallet
						},
						{
							label: 'Speak Up',
							href: '/for-studenter/speak-up',
							description: 'Opplevd noe kjipt? Speak Up!',
							icon: Heart
						}
					]}>For Studenter</HeaderButton
				>
				<HeaderButton
					links={[
						{
							label: 'Bedriftspresentasjon',
							href: '/for-bedrifter/bedriftspresentasjon',
							description: 'Ønsker du å presentere bedriften din?',
							icon: Presentation
						},
						{
							label: 'Stillingsannonser',
							href: '/for-bedrifter/stillingsutlysninger',
							description: 'Informasjon om stillingsutlysninger på våre nettsider',
							icon: Briefcase
						}
					]}>For Bedrifter</HeaderButton
				>
				<HeaderButton
					links={[
						{
							label: 'Om oss',
							href: '/om/echo',
							description: 'Om echo',
							icon: Atom
						},
						{
							label: 'Instituttrådet',
							href: '/om/instituttradet',
							description: 'Om instituttrådet',
							icon: Building2
						},
						{
							label: 'Vedtekter',
							href: '/om/vedtekter',
							description: 'Vedtekter',
							icon: Scale
						},
						{
							label: 'Bekk',
							href: '/om/bekk',
							description: 'Om Bekk, vår samarbeidspartner',
							icon: HeartHandshake
						},
						{
							label: 'Brosjyre',
							href: '/om/brosjyre',
							description: 'Brosjyre med informasjon om echo',
							icon: StickyNote
						},
						{
							label: 'Programstyrene',
							href: '/om/programstyrene',
							description: 'Oversikt over programstyrene',
							icon: Users
						},
						{
							label: 'Etiske retningslinjer',
							href: '/om/retningslinjer',
							description: 'Oversikt over etiske retningslinjer',
							icon: Scale
						}
					]}>Om echo</HeaderButton
				>
			</menu>
		</div>

		<div class="flex items-center gap-4">
			<button class="btn btn-primary">Logg inn</button>
		</div>
	</header>

	<HeaderDropdown />
</div>
