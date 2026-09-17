// Algemene Voorwaarden / General Terms and Conditions — direct
// request, both the Dutch original and the English version supplied
// by the user as finished legal documents (September 2026), each
// transcribed verbatim below, not summarized or edited. The English
// version is the user's own real translation, not a machine one (an
// earlier pass deliberately held off on auto-translating this exact
// document — see the terms-page memory note — precisely so this real
// version could replace a guess instead of fighting one). It is its
// own independent transcription, not forced to mirror the Dutch
// clause-for-clause: e.g. Dutch Artikel 7.3/7.4 split business-client
// vs. consumer collection-cost rules differently than English Article
// 7.3/7.4 does — both are transcribed exactly as their own source
// document reads, not harmonized against each other.
//
// Shape differs from legal-content.ts's LegalContentShape on purpose:
// Privacy is flat paragraphs + one trailing list per section: this
// document is numbered clauses (1., 2., 3.) with several clauses per
// language carrying their own lettered a/b/c sub-list mid-flow.
// Forcing that into LegalSection's shape would mean either losing the
// sub-lists or bolting on complexity Privacy doesn't need — a small
// parallel type is the honest fit. Rendering reuses every existing
// .legal-* CSS class as-is (see globals.css) — no new styles.
// Letterhead placeholders ("[KvK-nummer]"/"[KvK-number]" etc.) are
// copied verbatim from each source document, not reworded to match
// legal-content.ts's own placeholder phrasing — this is the user's own
// legal text in both languages.

export type TermsClause = {
  text: string;
  subItems?: string[];
};

export type TermsSection = {
  title: string;
  clauses: TermsClause[];
};

export type TermsContentShape = {
  updated: string;
  letterhead: string[];
  sections: TermsSection[];
};

export const TERMS_CONTENT: { nl: TermsContentShape; en: TermsContentShape } = {
  nl: {
    updated: "Versie: september 2026",
    letterhead: [
      "Voltair Studio",
      "E-mail: contact@voltairstudio.com",
      "KvK: [KvK-nummer]",
      "Btw-identificatienummer: [Btw-nummer]",
      "Gevestigd te: [Vestigingsplaats], Nederland",
    ],
    sections: [
      {
        title: "Artikel 1. Definities",
        clauses: [
          { text: "1. Voltair Studio: Voltair Studio, gebruiker van deze algemene voorwaarden en opdrachtnemer." },
          { text: "2. Opdrachtgever: Iedere natuurlijke persoon of rechtspersoon die met Voltair Studio een overeenkomst aangaat of aan wie Voltair Studio een offerte of voorstel uitbrengt." },
          { text: "3. Consument: Een natuurlijke persoon die niet handelt in de uitoefening van een beroep of bedrijf." },
          { text: "4. Zakelijke opdrachtgever: Een opdrachtgever die handelt in de uitoefening van een beroep of bedrijf." },
          { text: "5. Overeenkomst: Iedere overeenkomst tussen Voltair Studio en Opdrachtgever betreffende het leveren van diensten, waaronder onder meer webdesign, UI/UX-design, webdevelopment, software ontwikkeling, technisch advies, hosting, domeinregistratie, onderhoud, support en aanverwante diensten." },
          { text: "6. Offerte: Het schriftelijke of digitale voorstel van Voltair Studio waarin de werkzaamheden, prijs, planning en eventuele aanvullende voorwaarden zijn omschreven." },
          { text: "7. Werkzaamheden: Alle werkzaamheden die Voltair Studio op grond van de Overeenkomst uitvoert." },
          { text: "8. Deliverables: De specifiek voor Opdrachtgever ontwikkelde en overeengekomen resultaten, waaronder ontwerpen, webpagina's, grafische elementen, documentatie en maatwerk code." },
          { text: "9. Meerwerk: Werkzaamheden of functionaliteiten die buiten de oorspronkelijk overeengekomen scope vallen of het gevolg zijn van gewijzigde instructies na eerdere goedkeuring." },
          { text: "10. Derde Partij: Iedere externe leverancier of dienstverlener waarvan producten, software, infrastructuur, hosting, API's, licenties of andere diensten worden gebruikt bij de uitvoering van de Overeenkomst." },
        ],
      },
      {
        title: "Artikel 2. Toepasselijkheid & Terhandstelling",
        clauses: [
          { text: "1. Deze algemene voorwaarden zijn van toepassing op alle offertes, aanbiedingen, overeenkomsten, werkzaamheden en diensten van Voltair Studio, voor zover daarvan niet schriftelijk of digitaal uitdrukkelijk is afgeweken." },
          { text: "2. De toepasselijkheid van eventuele inkoop- of andere voorwaarden van Opdrachtgever wordt uitdrukkelijk van de hand gewezen, tenzij Voltair Studio deze vooraf uitdrukkelijk schriftelijk heeft aanvaard." },
          { text: "3. Afwijkingen van deze algemene voorwaarden zijn uitsluitend geldig indien deze schriftelijk of per e-mail door beide partijen zijn overeengekomen." },
          { text: "4. Voltair Studio stelt deze algemene voorwaarden voorafgaand aan of uiterlijk bij het sluiten van de Overeenkomst digitaal aan Opdrachtgever ter beschikking op een wijze waarop deze kunnen worden opgeslagen en later kunnen worden geraadpleegd." },
          { text: "5. Bij overeenkomsten met consumenten prevaleren dwingendrechtelijke wettelijke bepalingen indien een bepaling uit deze algemene voorwaarden daarmee strijdig is." },
          { text: "6. Indien een bepaling uit deze algemene voorwaarden nietig blijkt te zijn of wordt vernietigd, blijven de overige bepalingen onverminderd van kracht. Partijen zullen de betreffende bepaling, voor zover nodig, vervangen door een rechtsgeldige bepaling die de oorspronkelijke strekking zo dicht mogelijk benadert." },
        ],
      },
      {
        title: "Artikel 3. Offertes en totstandkoming van de Overeenkomst",
        clauses: [
          { text: "1. Iedere offerte van Voltair Studio is vrijblijvend, tenzij in de offerte uitdrukkelijk anders is vermeld." },
          { text: "2. Een offerte heeft een geldigheidsduur van 30 kalenderdagen na dagtekening, tenzij in de offerte een andere termijn is vermeld." },
          { text: "3. Voor zakelijke opdrachtgevers worden prijzen exclusief btw weergegeven. Voor consumenten worden prijzen inclusief de wettelijk verschuldigde btw en eventuele vooraf kenbare bijkomende kosten weergegeven." },
          {
            text: "4. De Overeenkomst komt tot stand zodra:",
            subItems: [
              "a. Opdrachtgever de offerte schriftelijk of digitaal aanvaardt;",
              "b. Opdrachtgever op andere wijze uitdrukkelijk akkoord gaat met de werkzaamheden; of",
              "c. Voltair Studio met instemming van Opdrachtgever feitelijk met de uitvoering begint.",
            ],
          },
          { text: "5. Indien Opdrachtgever slechts gedeeltelijk akkoord gaat met een offerte, komt geen overeenkomst tot stand, tenzij Voltair Studio schriftelijk bevestigt dat zij met de gewijzigde opdracht instemt." },
          { text: "6. Een samengestelde prijsopgave verplicht Voltair Studio niet tot uitvoering van slechts een gedeelte van de opdracht tegen een evenredig deel van de opgegeven prijs." },
          { text: "7. Kennelijke vergissingen, typefouten of rekenfouten in offertes binden Voltair Studio niet." },
        ],
      },
      {
        title: "Artikel 4. Uitvoering van de opdracht",
        clauses: [
          { text: "1. Voltair Studio zal de werkzaamheden naar beste inzicht en vermogen en conform de eisen van goed vakmanschap uitvoeren." },
          { text: "2. Voltair Studio heeft bij de uitvoering van de werkzaamheden een inspanningsverplichting, tenzij in de Overeenkomst uitdrukkelijk en schriftelijk een concreet resultaat of een resultaatsverplichting is vastgelegd." },
          { text: "3. Opgegeven doorlooptijden en opleverdata gelden als indicatief en vormen geen fatale termijnen, tenzij partijen schriftelijk uitdrukkelijk anders zijn overeengekomen." },
          { text: "4. Voltair Studio is gerechtigd bij de uitvoering gebruik te maken van derden, cloud platforms, hostingproviders, API's en open-source software." },
          { text: "5. Indien omstandigheden buiten de macht van Voltair Studio of vertragingen aan de zijde van Opdrachtgever leiden tot vertraging, wordt de planning redelijkerwijs aangepast." },
        ],
      },
      {
        title: "Artikel 5. Verplichtingen van Opdrachtgever (Cliënt Dependencies)",
        clauses: [
          { text: "1. Opdrachtgever draagt zorg voor de tijdige, volledige en correcte aanlevering van alle gegevens, teksten, beeldmaterialen, merkelementen, logo's, vertalingen en eventuele noodzakelijke externe API-sleutels en toegangsrechten in het door Voltair Studio gevraagde formaat." },
          { text: "2. Indien sprake is van een reeds bestaande domeinnaam of verhuizing van een domein naar het beheer van Voltair Studio, is Opdrachtgever verantwoordelijk voor het tijdig aanleveren van de juiste autorisatie code (EPP-token) en benodigde DNS-rechten." },
          { text: "3. Tenzij in de offerte een afwijkende reactietermijn is vastgelegd, geldt voor de aanlevering van benodigde content en feedback een maximale termijn van 5 werkdagen na een schriftelijk verzoek daartoe door Voltair Studio voor zakelijke opdrachtgevers, en 10 werkdagen voor consumenten." },
          { text: "4. Indien de benodigde gegevens of feedback niet tijdig worden verstrekt, heeft Voltair Studio het recht de uitvoering op te schorten. De planning schuift in dat geval redelijkerwijs op en aantoonbare extra werkzaamheden of gereserveerde capaciteit kunnen, voor zover vooraf kenbaar en redelijk, tegen het overeengekomen uurtarief in rekening worden gebracht." },
          { text: "5. Opdrachtgever staat in voor de juistheid en rechtmatigheid van de door hem aangeleverde materialen. Voor zover wettelijk toegestaan vrijwaart Opdrachtgever Voltair Studio tegen aanspraken van derden die rechtstreeks voortvloeien uit het ontbreken van de vereiste rechten, licenties of toestemming voor door Opdrachtgever aangeleverde materialen of gegevens." },
        ],
      },
      {
        title: "Artikel 6. Scope, revisies, fase-akkoord en Meerwerk",
        clauses: [
          { text: "1. De omvang van de werkzaamheden is beperkt tot hetgeen expliciet is beschreven in de offerte of opdrachtbevestiging." },
          { text: "2. Tenzij uitdrukkelijk anders overeengekomen, omvat iedere afgebakende projectfase maximaal twee (2) revisierondes binnen de kaders van de oorspronkelijke briefing." },
          { text: "3. Een revisieronde bestaat uit het eenmalig verwerken van gebundelde, duidelijke en concrete feedback op het op dat moment gepresenteerde werk." },
          { text: "4. Fase-goedkeuring: goedkeuring van een tussentijdse fase, zoals wireframes of UI-ontwerp, geldt als akkoord op die fase. Wijzigingen die daarna worden verzocht, kunnen als Meerwerk worden aangemerkt, tenzij het gaat om een gebrek of afwijking van de overeengekomen specificaties." },
          {
            text: "5. Als Meerwerk wordt tevens beschouwd:",
            subItems: [
              "a. nieuwe functionaliteiten of modules die niet in de offerte zijn opgenomen;",
              "b. uitbreiding van het overeengekomen aantal schermen of templates;",
              "c. aanpassingen als gevolg van wijzigingen in externe API's of platforms van derden;",
              "d. revisies na overschrijding van de twee inbegrepen revisierondes.",
            ],
          },
          { text: "6. Meerwerk wordt vooraf schriftelijk of digitaal gemeld met een redelijke inschatting van de kosten en, indien relevant, de gevolgen voor de planning. Bij Consumenten wordt meerwerk pas uitgevoerd na uitdrukkelijk voorafgaand akkoord." },
          { text: "7. Meerwerk wordt gefactureerd tegen het in de offerte vermelde uurtarief. Indien geen afwijkend tarief is overeengekomen, geldt voor zakelijke opdrachtgevers het standaard uurtarief van €85 exclusief btw." },
        ],
      },
      {
        title: "Artikel 7. Betaling en facturatie",
        clauses: [
          { text: "1. Facturen dienen binnen 14 dagen na factuurdatum te worden voldaan via bankoverschrijving of de door Voltair Studio aangeboden betaalmethode, tenzij schriftelijk anders is overeengekomen." },
          {
            text: "2. Voor projecten hanteert Voltair Studio standaard de volgende mijlpaalbetalingen:",
            subItems: [
              "a. 50% aanbetaling bij acceptatie van de offerte;",
              "b. 25% bij schriftelijke goedkeuring van het definitieve UI-ontwerp dan wel oplevering op de testomgeving (staging);",
              "c. 25% bij finale oplevering, vóór levering en overdracht van DNS/bestanden, tenzij anders overeengekomen.",
            ],
          },
          { text: "3. Indien Opdrachtgever niet tijdig betaalt, is Opdrachtgever, voor zover wettelijk vereist, na het verstrijken van de betalingstermijn in verzuim. Voor zakelijke opdrachtgevers is vanaf het intreden van het verzuim de wettelijke handelsrente als bedoeld in artikel 6:119a BW verschuldigd." },
          { text: "4. Buitengerechtelijke incassokosten worden voor zakelijke opdrachtgevers berekend overeenkomstig het Besluit vergoeding voor buitengerechtelijke incassokosten, met een minimum van € 40,-, tenzij schriftelijk anders overeengekomen. Voor consumenten worden incassokosten uitsluitend in rekening gebracht nadat aan alle wettelijke voorwaarden is voldaan, waaronder, indien vereist, een kosteloze aanmaning met een betalingstermijn van ten minste 14 dagen." },
          { text: "5. Bij het uitblijven van tijdige betaling heeft Voltair Studio, voor zover wettelijk toegestaan, het recht haar werkzaamheden op te schorten, waaronder het tijdelijk afschermen van staging-omgevingen. Het offline halen van een live website of het beperken van toegang tot klantdata vindt uitsluitend plaats voor zover dit wettelijk en contractueel is toegestaan en met inachtneming van de belangen van Opdrachtgever." },
        ],
      },
      {
        title: "Artikel 8. Annulering, herroeping en tussentijdse beëindiging",
        clauses: [
          { text: "1. Een zakelijke opdrachtgever kan een project vóór voltooiing annuleren met schriftelijke instemming van Voltair Studio, tenzij de Overeenkomst of de wet een ander recht geeft. Bij beëindiging zijn reeds uitgevoerde werkzaamheden, reeds gemaakte niet-annuleerbare kosten en reeds aangegane externe kosten verschuldigd." },
          { text: "2. Voor consumenten gelden bij annulering en beëindiging de wettelijke rechten en eventuele vooraf duidelijk overeengekomen voorwaarden." },
          { text: "3. Bij een overeenkomst op afstand met een consument geldt, voor zover wettelijk van toepassing, een wettelijke bedenktijd van 14 kalenderdagen." },
          { text: "4. Indien een consument uitdrukkelijk verzoekt om vóór het einde van de bedenktijd met de uitvoering van een dienst te beginnen, kan Voltair Studio vóór de start de wettelijk vereiste informatie en toestemming verkrijgen." },
          { text: "5. Indien de consument tijdens de bedenktijd rechtsgeldig herroept nadat op zijn uitdrukkelijk verzoek met de dienst is begonnen, kan de consument, voor zover wettelijk toegestaan, een evenredig bedrag verschuldigd zijn voor het reeds uitgevoerde deel." },
          { text: "6. Indien een dienst tijdens de bedenktijd volledig wordt uitgevoerd, kan het wettelijke herroepingsrecht alleen vervallen indien aan alle daarvoor geldende wettelijke voorwaarden is voldaan, waaronder de vereiste voorafgaande uitdrukkelijke instemming en erkenning van de gevolgen daarvan." },
          { text: "7. Voor digitale inhoud die niet op een materiële drager wordt geleverd, geldt het wettelijke regime dat specifiek op dergelijke digitale inhoud van toepassing is. Het herroepingsrecht vervalt alleen indien aan alle wettelijke voorwaarden voor het vervallen daarvan is voldaan." },
          { text: "8. Voltair Studio zal Consumenten vóór het sluiten van een overeenkomst informeren indien en waarom het herroepingsrecht niet van toepassing is." },
          { text: "9. Niets in deze algemene voorwaarden beperkt een wettelijk herroepingsrecht van een consument." },
        ],
      },
      {
        title: "Artikel 9. Oplevering, acceptatie en browsercompatibiliteit",
        clauses: [
          { text: "1. Voltair Studio levert de Deliverables via een beveiligde staging-omgeving, overeengekomen repository of andere overeengekomen methode." },
          { text: "2. Tenzij anders overeengekomen, geldt een acceptatieperiode van 10 werkdagen na de officiële opleveringsmelding voor zakelijke opdrachtgevers, en 14 kalenderdagen voor consumenten." },
          {
            text: "3. Een Deliverable geldt als geaccepteerd indien:",
            subItems: [
              "a. Opdrachtgever deze schriftelijk of digitaal goedkeurt;",
              "b. Opdrachtgever de Deliverable publiekelijk in gebruik neemt of operationeel inzet; of",
              "c. Opdrachtgever meldt niet binnen de acceptatieperiode concrete en voldoende onderbouwde gebreken.",
            ],
          },
          { text: "4. Acceptatie laat wettelijke rechten van consumenten en het recht om verborgen gebreken of niet-redelijkerwijs bij acceptatie te ontdekken afwijkingen te melden onverlet." },
          { text: "5. Kleine afwijkingen die het overeengekomen functioneren niet wezenlijk beïnvloeden, vormen geen reden tot weigering van acceptatie." },
          { text: "6. Browser- en platform ondersteuning: Deliverables worden, voor zover relevant voor de overeengekomen scope, geoptimaliseerd voor en getest op de twee meest recente stabiele hoofd versies van gangbare moderne desktop- en mobiele browsers, waaronder Google Chrome, Apple Safari, Mozilla Firefox en Microsoft Edge, op of rond de dag van oplevering. Ondersteuning voor verouderde, niet langer door leveranciers ondersteunde browsers of specifieke legacy-apparaten valt buiten de standaard scope, tenzij schriftelijk anders overeengekomen." },
          { text: "7. Derde-partij content, embedded diensten en functionaliteiten die afhankelijk zijn van externe platforms kunnen anders functioneren als de betreffende leverancier wijzigingen doorvoert." },
        ],
      },
      {
        title: "Artikel 10. Commerciële bugfix periode en wettelijke rechten",
        clauses: [
          { text: "1. Een bug is een aantoonbare en reproduceerbare technische fout in door Voltair Studio ontwikkelde maatwerk code waardoor het systeem niet functioneert overeenkomstig de schriftelijk overeengekomen specificaties." },
          { text: "2. Technische bugs die binnen 14 kalenderdagen na levering schriftelijk worden gemeld, worden door Voltair Studio kosteloos binnen een redelijke termijn hersteld, mits de oorzaak direct aan de eigen werkzaamheden van Voltair Studio kan worden toegerekend." },
          {
            text: "3. Buiten deze commerciële bugfix regeling vallen onder meer:",
            subItems: [
              "a. fouten of conflicten veroorzaakt door wijzigingen door Opdrachtgever of derden;",
              "b. problemen door storingen, API-wijzigingen of beleidswijzigingen bij externe providers;",
              "c. browsers, besturingssystemen of externe software die na oplevering worden uitgebracht;",
              "d. nieuwe functionaliteiten of wijzigingen van de oorspronkelijke specificaties.",
            ],
          },
          { text: "4. Na afloop van de commerciële bugfix periode worden herstel- en onderhoudswerkzaamheden uitgevoerd op basis van een onderhoudsovereenkomst of tegen het reguliere uurtarief, tenzij wettelijke rechten anders bepalen." },
          { text: "5. De commerciële bugfix periode beperkt of sluit geen wettelijke rechten van Consumenten uit." },
        ],
      },
      {
        title: "Artikel 11. Intellectuele eigendom en licenties",
        clauses: [
          { text: "1. Intellectuele eigendomsrechten die reeds vóór de Overeenkomst aan Voltair Studio toebehoren, waaronder generieke software, frameworks, componenten, templates, methodes, technieken, knowhow, tooling en ontwikkelt oplossingen, blijven bij Voltair Studio of de betreffende rechthebbende." },
          { text: "2. Voor specifiek voor Opdrachtgever vervaardigde Deliverables verkrijgt Opdrachtgever na volledige betaling een eeuwigdurende, niet-exclusieve licentie om deze te gebruiken, te publiceren en te exploiteren voor het doel waarvoor zij zijn ontwikkeld, tenzij schriftelijk anders overeengekomen." },
          { text: "3. De licentie omvat niet het recht om generieke Voltair Studio-componenten, frameworks, templates, libraries, tooling of ontwikkelmethodes als afzonderlijk product te verkopen, sublicentiëren of aan derden ter beschikking te stellen." },
          { text: "4. Indien partijen uitdrukkelijk een volledige overdracht van auteursrechten overeenkomen, vindt die overdracht uitsluitend plaats na volledige betaling en bij afzonderlijke schriftelijke akte, voor zover wettelijk vereist en voor zover de betreffende rechten overdraagbaar zijn." },
          { text: "5. Ongebruikte concepten, ontwerpen en alternatieve voorstellen blijven bij Voltair Studio, tenzij schriftelijk anders overeengekomen." },
          { text: "6. Software, fonts, afbeeldingen, libraries, API's, frameworks, open-source componenten en andere materialen van derden blijven onderworpen aan de toepasselijke licentievoorwaarden van de betreffende rechthebbenden." },
          { text: "7. Voltair Studio behoudt het recht om algemene kennis, vaardigheden, technieken, ideeën en niet-klantspecifieke oplossingen die zij tijdens de opdracht ontwikkelt of gebruikt opnieuw toe te passen." },
          { text: "8. Voltair Studio mag gerealiseerde projecten gebruiken voor portfolio- en marketingdoeleinden, tenzij schriftelijke geheimhouding is overeengekomen of Voltair Studio vooraf schriftelijk heeft toegezegd het project niet openbaar te maken. Voor consumenten wordt, indien het project of de identiteit van de consument als referentie wordt gebruikt, vooraf toestemming gevraagd." },
        ],
      },
      {
        title: "Artikel 12. Broncode, repositories en toegang",
        clauses: [
          { text: "1. Indien broncode onderdeel is van de overeengekomen Deliverables, wordt deze na volledige betaling beschikbaar gesteld voor zover dit volgens toepasselijke licenties en de Overeenkomst is toegestaan." },
          { text: "2. Broncode van open-source- of andere software van derden is niet het eigendom van Voltair Studio en blijft onder de betreffende licentievoorwaarden vallen." },
          { text: "3. Tenzij anders overeengekomen, blijven generieke Voltair Studio-boilerplates, component bibliotheken, deployment-scripts en ontwikkeltools onderdeel van de eigen ontwikkelomgeving van Voltair Studio." },
          { text: "4. Toegang tot een Git-repository, hostingomgeving, deployment omgeving, database of andere technische omgeving wordt verstrekt volgens de afspraken in de offerte of overeenkomst." },
          { text: "5. API-sleutels, wachtwoorden, environment variables en andere geheime credentials worden niet als algemene broncode opgeleverd en worden uitsluitend overgedragen indien dit noodzakelijk en veilig is en schriftelijk is overeengekomen." },
          { text: "6. Indien volledige overdracht van een project of repository is overeengekomen, worden de omvang en wijze van overdracht vooraf schriftelijk vastgelegd." },
        ],
      },
      {
        title: "Artikel 13. Hosting, domeinnamen en retentierechten",
        clauses: [
          { text: "1. Voltair Studio kan webhosting en domeinregistratie of -beheer leveren via haar eigen hostingpakketten en infrastructuurpartners, conform de specificaties en tarieven in de offerte." },
          { text: "2. Tenzij schriftelijk anders overeengekomen, worden hosting- en domein overeenkomsten aangegaan voor een initiële periode van één (1) jaar. Voor Zakelijke opdrachtgevers kunnen deze na afloop worden verlengd overeenkomstig de overeengekomen voorwaarden. Voor Consumenten wordt na de eerste vaste periode, indien de overeenkomst wordt voortgezet, een overeenkomst voor onbepaalde tijd aangegaan en geldt een opzegtermijn van maximaal één maand." },
          { text: "3. Voltair Studio streeft naar een zo hoog mogelijke beschikbaarheid en beveiliging, maar garandeert geen ononderbroken beschikbaarheid tenzij een SLA of andere resultaatsverplichting is overeengekomen." },
          { text: "4. Voor zover wettelijk toegestaan is Voltair Studio niet aansprakelijk voor downtime of storingen die volledig zijn veroorzaakt door externe datacenter-, cloud-, netwerk-, DNS-, hosting- of infrastructuurleveranciers." },
          { text: "5. Een domeinnaam die namens Opdrachtgever wordt geregistreerd, wordt tenzij schriftelijk anders overeengekomen op naam van Opdrachtgever geregistreerd. De registratie blijft onderworpen aan de voorwaarden van de betreffende registrar en registry." },
          { text: "6. Na beëindiging zal Voltair Studio, voor zover redelijk en technisch mogelijk, meewerken aan de overdracht van het domein en de relevante bestanden, met inachtneming van eventuele openstaande betalingsverplichtingen en wettelijke rechten." },
          { text: "7. Voor zover wettelijk toegestaan kan Voltair Studio haar aanspraak op betaling uitoefenen door werkzaamheden, toegang tot beheerde omgevingen of overdracht van eigen bedrijfsbestanden op te schorten. Dit laat de eigendoms- en registratierechten van Opdrachtgever op diens eigen domein onverlet." },
          { text: "8. Na beëindiging van hosting of onderhoud bewaart Voltair Studio bestanden, databases en back-ups maximaal 30 kalenderdagen, tenzij een langere bewaartermijn wettelijk verplicht is of noodzakelijk is voor het vaststellen, uitoefenen of verdedigen van rechtsvorderingen. Daarna worden deze, voor zover wettelijk toegestaan, verwijderd." },
          { text: "9. Opdrachtgever is zelf verantwoordelijk voor het tijdig veiligstellen van gegevens indien geen afzonderlijke back-updienst is overeengekomen." },
        ],
      },
      {
        title: "Artikel 14. Hosting, onderhoud en periodieke diensten",
        clauses: [
          { text: "1. Onderhoud, updates, ondersteuning en periodieke werkzaamheden zijn uitsluitend inbegrepen indien dit uitdrukkelijk in de offerte of overeenkomst is opgenomen." },
          { text: "2. Zonder onderhoudsovereenkomst is Voltair Studio niet verplicht toekomstige updates, beveiligingsupdates, framework wijzigingen, browser wijzigingen of wijzigingen van externe API's kosteloos te verwerken." },
          { text: "3. Voor consumenten geldt een initiële vaste looptijd van maximaal één jaar, tenzij de wet anders toestaat. Na afloop kan de overeenkomst, indien voortgezet, voor onbepaalde tijd worden voortgezet met een opzegtermijn van maximaal één maand." },
          { text: "4. Voor zakelijke opdrachtgevers gelden de overeengekomen looptijd en opzegvoorwaarden uit de offerte of overeenkomst." },
          { text: "5. Indien een periodiek tarief kan worden gewijzigd, wordt de toepasselijke wijzigingsbevoegdheid en eventuele opzegmogelijkheid vooraf duidelijk vastgelegd." },
        ],
      },
      {
        title: "Artikel 15. Externe diensten, tools en API's",
        clauses: [
          { text: "1. Voltair Studio kan bij de ontwikkeling gebruikmaken van diensten en API's van derden, waaronder betalingsproviders, externe databases, cloud platforms, kaartdiensten, analytics diensten, SaaS-diensten en software libraries." },
          { text: "2. Kosten voor externe diensten die niet expliciet in de geoffreerde prijs zijn inbegrepen, zijn voor rekening van Opdrachtgever indien dit vooraf kenbaar is gemaakt of de kosten redelijkerwijs noodzakelijk zijn voor een door Opdrachtgever verzocht gebruik van die externe dienst." },
          { text: "3. Voltair Studio is, voor zover wettelijk toegestaan, niet aansprakelijk voor schade, vertragingen of storingen die rechtstreeks het gevolg zijn van wijzigingen, storingen, beëindiging, beperkingen of prijswijzigingen bij externe leveranciers." },
          { text: "4. Noodzakelijke aanpassingen als gevolg van wijzigingen bij externe leveranciers kunnen als Meerwerk worden uitgevoerd, nadat Opdrachtgever daarover is geïnformeerd." },
          { text: "5. Opdrachtgever is verantwoordelijk voor het tijdig voldoen van abonnementskosten en het naleven van voorwaarden van externe diensten die op naam van Opdrachtgever zijn afgesloten." },
        ],
      },
      {
        title: "Artikel 16. Privacy en gegevensverwerking (AVG)",
        clauses: [
          { text: "1. Partijen handelen bij de verwerking van persoonsgegevens conform de toepasselijke privacywetgeving, waaronder de AVG." },
          { text: "2. Opdrachtgever is verantwoordelijk voor de rechtmatigheid van persoonsgegevens die via de ontwikkelde website of applicatie worden verzameld, tenzij schriftelijk anders overeengekomen." },
          { text: "3. Indien Voltair Studio persoonsgegevens namens Opdrachtgever verwerkt als verwerker in de zin van de AVG, sluiten partijen een verwerkersovereenkomst waarin de wettelijk vereiste afspraken zijn opgenomen." },
          { text: "4. Indien een afzonderlijke verwerkersovereenkomst van toepassing is, prevaleert deze bij tegenstrijdigheid met deze algemene voorwaarden voor zover het de verwerking van persoonsgegevens betreft." },
          { text: "5. Voltair Studio kan voor de uitvoering gebruikmaken van sub verwerkers of andere externe dienstverleners, voor zover dit rechtmatig en noodzakelijk is." },
          { text: "6. Opdrachtgever blijft verantwoordelijk voor de inhoud en rechtmatigheid van diens privacyverklaring, cookiebeleid, cookie toestemming en andere juridische teksten, tenzij het opstellen of juridisch beoordelen daarvan uitdrukkelijk als afzonderlijke opdracht is overeengekomen." },
          { text: "7. Voltair Studio verstrekt geen juridisch advies en garandeert niet dat een website volledig voldoet aan alle toepasselijke wet- en regelgeving, tenzij daarvoor uitdrukkelijk een afzonderlijke adviesopdracht is overeengekomen." },
        ],
      },
      {
        title: "Artikel 17. Beveiliging",
        clauses: [
          { text: "1. Voltair Studio neemt binnen de overeengekomen scope redelijke technische maatregelen om de door haar beheerde systemen en gegevens adequaat te beveiligen." },
          { text: "2. Geen enkel systeem kan volledig vrij van beveiligingsrisico's worden gegarandeerd." },
          { text: "3. Opdrachtgever is verantwoordelijk voor het zorgvuldig omgaan met wachtwoorden, accounts, API-sleutels en toegangsgegevens aan zijn zijde." },
          { text: "4. Indien een beveiligingsincident geheel of gedeeltelijk ontstaat door handelen of nalaten van Opdrachtgever of een door hem ingeschakelde derde, is Voltair Studio daarvoor niet aansprakelijk voor zover dit wettelijk is toegestaan." },
        ],
      },
      {
        title: "Artikel 18. Aansprakelijkheid",
        clauses: [
          { text: "1. Voltair Studio is uitsluitend aansprakelijk voor directe schade die het rechtstreekse gevolg is van een toerekenbare tekortkoming in de uitvoering van de Overeenkomst, voor zover aansprakelijkheid niet wettelijk is uitgesloten of beperkt." },
          { text: "2. Voor zakelijke opdrachtgevers is de totale aansprakelijkheid voor directe schade per gebeurtenis of samenhangende reeks van gebeurtenissen beperkt tot maximaal het factuurbedrag dat voor de betreffende specifieke opdracht is overeengekomen c.q. het daadwerkelijk door de opdrachtgever voor die specifieke opdracht betaalde bedrag." },
          { text: "3. Voltair Studio is voor zakelijke opdrachtgevers, voor zover wettelijk toegestaan, uitdrukkelijk niet aansprakelijk voor indirecte schade, waaronder begrepen maar niet beperkt tot gevolgschade, gederfde winst, gemiste besparingen, verlies van gegevens, verlies van goodwill, reputatieschade, verminderde opbrengst en bedrijfsstagnatie." },
          { text: "4. Voltair Studio is voor zover wettelijk toegestaan niet aansprakelijk voor schade die uitsluitend het gevolg is van storingen, fouten of wijzigingen bij externe leveranciers of door Opdrachtgever gekozen externe diensten." },
          { text: "5. Voltair Studio is niet aansprakelijk voor schade die ontstaat door onjuiste of onvolledige informatie van Opdrachtgever of door wijzigingen die Opdrachtgever of derden zonder toestemming van Voltair Studio aan de website, code, serveromgeving of configuratie hebben aangebracht." },
          { text: "6. Voor consumenten gelden de wettelijke aansprakelijkheidsregels en kunnen de bepalingen van dit artikel wettelijke consumentenrechten niet beperken." },
          { text: "7. De aansprakelijkheidsbeperkingen gelden niet indien en voor zover beperking daarvan op grond van dwingend recht niet is toegestaan, waaronder bij opzet of bewuste roekeloosheid aan de zijde van Voltair Studio." },
          { text: "8. Opdrachtgever dient schade zo spoedig mogelijk na ontdekking schriftelijk te melden. Een late melding leidt niet automatisch tot verval van rechten; eventuele wettelijke regels en redelijke belangen van beide partijen blijven van toepassing." },
        ],
      },
      {
        title: "Artikel 19. Overmacht (Force Majeure)",
        clauses: [
          { text: "1. Voltair Studio is niet gehouden tot het nakomen van een verplichting indien zij daartoe wordt verhinderd door een omstandigheid die redelijkerwijs niet aan haar kan worden toegerekend." },
          { text: "2. Onder overmacht wordt mede verstaan: storingen in internet- of telecommunicatienetwerken, stroomuitval, grootschalige DDoS- of cyberaanvallen, overheidsmaatregelen, ziekte van cruciaal personeel en tekortkomingen van ingeschakelde toeleveranciers of upstream cloud providers." },
          { text: "3. Indien de overmachtsituatie langer dan 60 aaneengesloten kalenderdagen voortduurt, hebben partijen het recht de overeenkomst schriftelijk te beëindigen, voor zover de wet dit toestaat, zonder verplichting tot schadevergoeding." },
          { text: "4. Reeds uitgevoerde werkzaamheden en reeds gemaakte niet-annuleerbare kosten blijven, voor zover wettelijk toegestaan, verschuldigd." },
        ],
      },
      {
        title: "Artikel 20. Geheimhouding",
        clauses: [
          { text: "1. Partijen verplichten zich over en weer tot geheimhouding van alle vertrouwelijke informatie die zij in het kader van de offerte of samenwerking verkrijgen." },
          { text: "2. Informatie geldt als vertrouwelijk indien dit expliciet is meegedeeld of redelijkerwijs uit de aard van de informatie blijkt." },
          { text: "3. De geheimhoudingsplicht geldt niet voor informatie die reeds openbaar was, rechtmatig van een derde is verkregen, onafhankelijk is ontwikkeld of op grond van een wettelijke verplichting moet worden verstrekt." },
          { text: "4. Deze verplichting blijft na beëindiging van de Overeenkomst van kracht voor zover redelijkerwijs noodzakelijk." },
        ],
      },
      {
        title: "Artikel 21. Klachten",
        clauses: [
          { text: "1. Klachten over werkzaamheden, dienstverlening of facturen kunnen schriftelijk of per e-mail worden ingediend bij Voltair Studio." },
          { text: "2. Opdrachtgever dient klachten zo spoedig mogelijk na ontdekking te melden, zodat Voltair Studio in staat wordt gesteld het probleem tijdig te onderzoeken en, indien van toepassing, te herstellen." },
          { text: "3. Een klacht bevat voldoende informatie om Voltair Studio in staat te stellen de klacht te beoordelen." },
          { text: "4. Voltair Studio zal binnen een redelijke termijn op een klacht reageren en, waar mogelijk, met Opdrachtgever naar een oplossing zoeken." },
          { text: "5. Het indienen van een klacht schort de betalingsverplichting niet automatisch op." },
          { text: "6. Wettelijke rechten van consumenten blijven onverminderd van toepassing." },
        ],
      },
      {
        title: "Artikel 22. Portfolio en publiciteit",
        clauses: [
          { text: "1. Voltair Studio mag gerealiseerde projecten als referentie gebruiken overeenkomstig artikel 11." },
          { text: "2. Voltair Studio zal daarbij geen vertrouwelijke informatie publiceren." },
          { text: "3. Indien vooraf schriftelijk is overeengekomen dat een project vertrouwelijk wordt behandeld of niet openbaar mag worden gemaakt, zal Voltair Studio zich daaraan houden." },
        ],
      },
      {
        title: "Artikel 23. Wijzigingen van de algemene voorwaarden",
        clauses: [
          { text: "1. Voor nieuwe overeenkomsten kan Voltair Studio deze algemene voorwaarden wijzigen of aanvullen." },
          { text: "2. Voor lopende overeenkomsten worden wijzigingen uiterlijk 30 dagen voorafgaand aan de inwerkingtreding schriftelijk of digitaal bekendgemaakt. Indien de wijziging ten nadele van Opdrachtgever is, heeft Opdrachtgever het recht de overeenkomst bezwaar te maken of per de datum waarop de wijziging ingaat te beëindigen." },
          { text: "3. Voor consumenten worden wijzigingen in lopende overeenkomsten alleen doorgevoerd voor zover dit wettelijk is toegestaan, de wijziging niet onredelijk bezwarend is en aan eventuele informatie- en opzeggingskosten wordt voldaan." },
          { text: "4. Een gewijzigde versie wordt tijdig aan Opdrachtgever beschikbaar gesteld wanneer de wet of de overeenkomst dit vereist." },
        ],
      },
      {
        title: "Artikel 24. Duur en opzegging van zakelijke overeenkomsten",
        clauses: [
          { text: "1. De duur van een zakelijke overeenkomst wordt bepaald in de offerte of overeenkomst." },
          { text: "2. Een overeenkomst voor bepaalde tijd eindigt op de overeengekomen einddatum, tenzij partijen anders overeenkomen of de overeenkomst rechtsgeldig wordt verlengd." },
          { text: "3. Indien automatische verlenging van een zakelijke overeenkomst is overeengekomen, dient opzegging te geschieden met inachtneming van een opzegtermijn van 1 maand vóór het einde van de lopende termijn, tenzij in de offerte of overeenkomst anders is bepaald." },
          { text: "4. Een overeenkomst voor onbepaalde tijd kan door iedere partij worden opgezegd met inachtneming van de overeengekomen opzegtermijn." },
          { text: "5. Bij een ernstige tekortkoming kan de andere partij de overeenkomst beëindigen nadat de tekortkomende partij een redelijke mogelijkheid heeft gekregen de tekortkoming te herstellen, tenzij herstel redelijkerwijs niet kan worden verlangd." },
        ],
      },
      {
        title: "Artikel 25. Opschorting",
        clauses: [
          { text: "1. Voltair Studio kan, voor zover wettelijk toegestaan, haar werkzaamheden opschorten indien de opdrachtgever wezenlijk tekortschiet in een betalings- of medewerkingsverplichting." },
          { text: "2. Voltair Studio zal Opdrachtgever waar redelijkerwijs mogelijk vooraf informeren over de opschorting." },
          { text: "3. Opschorting laat reeds ontstane betalingsverplichtingen onverlet." },
          { text: "4. Opschorting wordt niet toegepast op een wijze die in strijd is met dwingend consumentenrecht of die onnodig toegang tot wettelijk beschermde persoonsgegevens verhindert." },
        ],
      },
      {
        title: "Artikel 26. Toepasselijk recht en bevoegde rechter",
        clauses: [
          { text: "1. Op alle rechtsbetrekkingen tussen Voltair Studio en Opdrachtgever is Nederlands recht van toepassing." },
          { text: "2. Geschillen die niet in minnelijk overleg kunnen worden opgelost, kunnen worden voorgelegd aan de volgens de wet bevoegde rechter." },
          { text: "3. Voor zakelijke opdrachtgevers kan, voor zover wettelijk toegestaan, een geschil worden voorgelegd aan de bevoegde rechter in het arrondissement waar Voltair Studio statutair is gevestigd." },
          { text: "4. Consumenten worden niet beperkt in hun recht om een geschil voor te leggen aan de rechter die volgens dwingend recht bevoegd is." },
        ],
      },
      {
        title: "Artikel 27. Slotbepalingen",
        clauses: [
          { text: "1. Indien een bepaling uit deze algemene voorwaarden ongeldig, nietig of vernietigbaar blijkt te zijn, blijven de overige bepalingen volledig van kracht." },
          { text: "2. Partijen zullen, indien nodig, de betreffende bepaling vervangen door een rechtsgeldige bepaling die de bedoeling van de oorspronkelijke bepaling zo veel mogelijk benadert." },
          { text: "3. De administratie van Voltair Studio geldt uitsluitend ten aanzien van zakelijke opdrachtgevers, behoudens tegenbewijs, als bewijs van de door haar verrichte werkzaamheden, betalingen en communicatie, voor zover wettelijk toegestaan. Voor consumenten is deze bepaling niet van toepassing overeenkomstig artikel 6:237 BW." },
          { text: "4. Deze algemene voorwaarden zijn vastgesteld in september 2026 en gelden voor offertes en overeenkomsten waarop deze versie van toepassing is." },
        ],
      },
    ],
  },
  en: {
    updated: "Version: September 2026",
    letterhead: [
      "Voltair Studio",
      "Email: contact@voltairstudio.com",
      "Chamber of Commerce (KvK): [KvK-number]",
      "VAT Identification Number: [VAT-number]",
      "Established in: [Place], The Netherlands",
    ],
    sections: [
      {
        title: "Article 1. Definitions",
        clauses: [
          { text: "1. Voltair Studio: Voltair Studio, user of these general terms and conditions and service provider/contractor." },
          { text: "2. Client: Any natural person or legal entity that enters into an agreement with Voltair Studio or to whom Voltair Studio submits an offer or proposal." },
          { text: "3. Consumer: A natural person not acting in the course of a profession or business." },
          { text: "4. Business Client: A client acting in the course of a profession or business." },
          { text: "5. Agreement: Any agreement between Voltair Studio and Client regarding the provision of services, including web design, UI/UX design, web development, software development, technical consulting, hosting, domain registration, maintenance, support, and related services." },
          { text: "6. Quotation: The written or digital proposal from Voltair Studio describing the work, price, schedule, and any additional conditions." },
          { text: "7. Work: All activities performed by Voltair Studio pursuant to the Agreement." },
          { text: "8. Deliverables: The results specifically developed and agreed upon for Client, including designs, web pages, graphic elements, documentation, and custom code." },
          { text: "9. Additional Work: Work or functionalities falling outside the originally agreed scope or resulting from modified instructions after prior approval." },
          { text: "10. Third Party: Any external supplier or service provider whose products, software, infrastructure, hosting, APIs, licenses, or other services are used in executing the Agreement." },
        ],
      },
      {
        title: "Article 2. Applicability & Provision",
        clauses: [
          { text: "1. These general terms and conditions apply to all quotations, offers, agreements, work, and services of Voltair Studio, unless explicitly deviated from in writing or digitally." },
          { text: "2. The applicability of any purchase or other terms and conditions of Client is explicitly rejected, unless Voltair Studio has explicitly accepted them in writing in advance." },
          { text: "3. Deviations from these general terms and conditions are valid only if agreed upon in writing or via email by both parties." },
          { text: "4. Voltair Studio makes these general terms and conditions available digitally to Client prior to or at the latest upon conclusion of the Agreement in a manner allowing them to be stored and accessed for future reference." },
          { text: "5. In agreements with consumers, mandatory statutory provisions prevail if a provision in these terms and conditions conflicts with them." },
          { text: "6. If any provision of these general terms and conditions proves to be void or is annulled, the remaining provisions remain in full force and effect. Parties shall replace the provision in question with a valid provision that approximates the original intent as closely as possible." },
        ],
      },
      {
        title: "Article 3. Quotations and Conclusion of the Agreement",
        clauses: [
          { text: "1. Every quotation from Voltair Studio is non-binding, unless explicitly stated otherwise in the quotation." },
          { text: "2. A quotation is valid for 30 calendar days from the date of issuance, unless a different term is stated in the quotation." },
          { text: "3. For business clients, prices are displayed excluding VAT. For consumers, prices are displayed including statutory VAT and any identifiable additional costs in advance." },
          {
            text: "4. The Agreement is concluded as soon as:",
            subItems: [
              "a. Client accepts the quotation in writing or digitally;",
              "b. Client otherwise explicitly agrees to the work; or",
              "c. Voltair Studio actually commences execution with the consent of Client.",
            ],
          },
          { text: "5. If Client agrees to a quotation only partially, no agreement is concluded unless Voltair Studio confirms in writing that it agrees to the modified assignment." },
          { text: "6. A composite price quote does not obligate Voltair Studio to perform only a portion of the assignment for a proportionate share of the quoted price." },
          { text: "7. Obvious mistakes, typographical errors, or calculation errors in quotations do not bind Voltair Studio." },
        ],
      },
      {
        title: "Article 4. Execution of the Assignment",
        clauses: [
          { text: "1. Voltair Studio shall execute the work to the best of its knowledge and ability and in accordance with the requirements of good workmanship." },
          { text: "2. Voltair Studio has an obligation of effort in executing the work, unless a concrete result or result obligation is explicitly and in writing established in the Agreement." },
          { text: "3. Stated lead times and delivery dates are indicative and do not constitute strict deadlines, unless explicitly agreed otherwise in writing by the parties." },
          { text: "4. Voltair Studio is entitled to make use of third parties, cloud platforms, hosting providers, APIs, and open-source software in executing the work." },
          { text: "5. If circumstances beyond the control of Voltair Studio or delays on Client's part lead to a delay, the schedule shall be reasonably adjusted." },
        ],
      },
      {
        title: "Article 5. Client Obligations (Client Dependencies)",
        clauses: [
          { text: "1. Client ensures the timely, complete, and correct delivery of all data, text, imagery, brand elements, logos, translations, and any necessary external API keys and access rights in the format requested by Voltair Studio." },
          { text: "2. In the event of an existing domain name or domain transfer to Voltair Studio management, Client is responsible for timely providing the correct authorization code (EPP token) and necessary DNS rights." },
          { text: "3. Unless a different response period is established in the quotation, a maximum period of 5 working days for business clients and 10 working days for consumers applies for providing necessary content and feedback following a written request by Voltair Studio." },
          { text: "4. If the required data or feedback is not provided in a timely manner, Voltair Studio has the right to suspend execution. The schedule shifts reasonably, and demonstrable extra work or reserved capacity may, insofar as foreseeable and reasonable, be charged at the agreed hourly rate." },
          { text: "5. Client warrants the accuracy and legality of materials provided. Insofar as legally permitted, Client indemnifies Voltair Studio against third-party claims directly arising from the lack of required rights, licenses, or consent for materials or data provided by Client." },
        ],
      },
      {
        title: "Article 6. Scope, Revisions, Phase Approval, and Additional Work",
        clauses: [
          { text: "1. The scope of work is limited to what is explicitly described in the quotation or order confirmation." },
          { text: "2. Unless explicitly agreed otherwise, each defined project phase includes a maximum of two (2) revision rounds within the framework of the original brief." },
          { text: "3. A revision round consists of the single processing of bundled, clear, and concrete feedback on the work presented at that time." },
          { text: "4. Phase approval: approval of an intermediate phase, such as wireframes or UI design, constitutes agreement on that phase. Subsequent change requests may be marked as Additional Work, unless it concerns a defect or deviation from agreed specifications." },
          {
            text: "5. Additional Work shall also include:",
            subItems: [
              "a. new functionalities or modules not included in the quotation;",
              "b. expansion of the agreed number of screens or templates;",
              "c. adjustments resulting from changes in external APIs or third-party platforms;",
              "d. revisions beyond the two included revision rounds.",
            ],
          },
          { text: "6. Additional Work will be reported in advance in writing or digitally with a reasonable cost estimate and, if relevant, the schedule impact. For consumers, additional work will only be performed after explicit prior agreement." },
          { text: "7. Additional Work is invoiced at the hourly rate stated in the quotation. If no specific rate is agreed, the standard hourly rate of €85 excluding VAT applies to business clients." },
        ],
      },
      {
        title: "Article 7. Payment and Invoicing",
        clauses: [
          { text: "1. Invoices must be paid within 14 days of the invoice date via bank transfer or the payment method offered by Voltair Studio, unless otherwise agreed in writing." },
          {
            text: "2. For projects, Voltair Studio applies the following standard milestone payments:",
            subItems: [
              "a. 50% advance payment upon acceptance of the quotation;",
              "b. 25% upon written approval of the final UI design or delivery to the staging environment;",
              "c. 25% upon final completion, prior to delivery and transfer of DNS/files, unless agreed otherwise.",
            ],
          },
          { text: "3. Upon non-payment or late payment, the business client is in default by operation of law from the due date, without any notice of default being required. From that moment, the business client owes statutory commercial interest. Furthermore, the business client is bound to compensate all extrajudicial collection costs, calculated in accordance with the Dutch Extrajudicial Collection Costs Decree (Besluit vergoeding voor buitengerechtelijke incassokosten), with a minimum of €40." },
          { text: "4. For consumers, collection costs are only charged after all statutory requirements have been met, including, if required, a notice without cost with a payment term of at least 14 days." },
          { text: "5. In the event of non-payment, Voltair Studio has the right, insofar as legally permitted, to suspend its work, including temporarily blocking staging environments. Taking a live website offline or restricting access to customer data will only occur insofar as legally and contractually permitted and taking Client's interests into account." },
        ],
      },
      {
        title: "Article 8. Cancellation, Right of Withdrawal, and Early Termination",
        clauses: [
          { text: "1. A business client may cancel a project prior to completion with written consent from Voltair Studio, unless the Agreement or law grants another right. Upon termination, work already performed, non-cancellable costs incurred, and external costs entered into are due." },
          { text: "2. For consumers, statutory rights and any clearly agreed conditions apply to cancellation and termination." },
          { text: "3. For distance contracts with consumers, a statutory cooling-off period of 14 calendar days applies insofar as legally applicable." },
          { text: "4. If a consumer explicitly requests performance of a service to begin during the cooling-off period, Voltair Studio may obtain the required information and consent prior to commencement." },
          { text: "5. If the consumer legally revokes during the cooling-off period after service performance has begun at their explicit request, the consumer may owe a proportionate amount for the portion already performed, insofar as legally permitted." },
          { text: "6. If a service is fully performed during the cooling-off period, the statutory right of withdrawal can only lapse if all statutory conditions for lapse are met, including required explicit prior consent and acknowledgement of consequences." },
          { text: "7. For digital content not delivered on a tangible medium, the specific statutory regime applies. The right of withdrawal lapses only if all statutory conditions are met." },
          { text: "8. Voltair Studio shall inform consumers prior to entering into an agreement if and why the right of withdrawal does not apply." },
          { text: "9. Nothing in these general terms and conditions restricts a consumer's statutory right of withdrawal." },
        ],
      },
      {
        title: "Article 9. Delivery, Acceptance, and Browser Compatibility",
        clauses: [
          { text: "1. Voltair Studio delivers Deliverables via a secure staging environment, agreed repository, or other agreed method." },
          { text: "2. Unless agreed otherwise, an acceptance period of 10 working days applies following the official completion notice for business clients, and 14 calendar days for consumers." },
          {
            text: "3. A Deliverable is deemed accepted if:",
            subItems: [
              "a. Client approves it in writing or digitally;",
              "b. Client puts the Deliverable into public or operational use; or",
              "c. Client does not report concrete and sufficiently substantiated defects within the acceptance period.",
            ],
          },
          { text: "4. Acceptance leaves statutory rights of consumers and the right to report hidden defects or deviations not reasonably discoverable upon acceptance unaffected." },
          { text: "5. Minor deviations that do not substantially affect agreed functionality do not constitute grounds for withholding acceptance." },
          { text: "6. Browser and platform support: Deliverables are optimized for and tested on the two most recent stable major versions of common modern desktop and mobile browsers (Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge) on or around the delivery date. Support for outdated browsers or legacy devices falls outside standard scope, unless agreed in writing." },
          { text: "7. Third-party content, embedded services, and functionalities depending on external platforms may function differently if the respective vendor introduces changes." },
        ],
      },
      {
        title: "Article 10. Commercial Bug Fix Period and Statutory Rights",
        clauses: [
          { text: "1. A bug is a demonstrable and reproducible technical error in custom code developed by Voltair Studio causing the system not to function in accordance with written agreed specifications." },
          { text: "2. Technical bugs reported in writing within 14 calendar days after delivery will be repaired free of charge by Voltair Studio within a reasonable period, provided the cause is directly attributable to Voltair Studio's own work." },
          {
            text: "3. Excluded from this commercial bug fix scheme are:",
            subItems: [
              "a. errors or conflicts caused by modifications by Client or third parties;",
              "b. issues due to outages, API changes, or policy changes at external providers;",
              "c. browsers, operating systems, or external software released after delivery;",
              "d. new functionalities or changes to original specifications.",
            ],
          },
          { text: "4. After the commercial bug fix period, maintenance and repair work will be performed under a maintenance agreement or at the regular hourly rate, unless statutory rights dictate otherwise." },
          { text: "5. The commercial bug fix period does not limit or exclude statutory consumer rights." },
        ],
      },
      {
        title: "Article 11. Intellectual Property and Licenses",
        clauses: [
          { text: "1. Intellectual property rights belonging to Voltair Studio prior to the Agreement, including generic software, frameworks, components, templates, methods, techniques, know-how, tooling, and development solutions, remain with Voltair Studio or the respective rights holder." },
          { text: "2. For Deliverables specifically created for Client, Client obtains a perpetual, non-exclusive license upon full payment to use, publish, and exploit them for the purpose for which they were developed, unless agreed otherwise in writing." },
          { text: "3. The license does not include the right to sell, sublicense, or make available to third parties generic Voltair Studio components, frameworks, templates, libraries, tooling, or development methods as a separate product." },
          { text: "4. If parties explicitly agree on a full transfer of copyrights, such transfer shall take place exclusively after full payment and by separate deed in writing, insofar as legally required and insofar as transferable." },
          { text: "5. Unused concepts, designs, and alternative proposals remain with Voltair Studio, unless agreed otherwise in writing." },
          { text: "6. Third-party software, fonts, images, libraries, APIs, frameworks, and open-source components remain subject to applicable license terms of the respective rights holders." },
          { text: "7. Voltair Studio retains the right to reuse general knowledge, skills, techniques, ideas, and non-client-specific solutions developed or used during the assignment." },
          { text: "8. Voltair Studio may use completed projects for portfolio and marketing purposes, unless written confidentiality is agreed or Voltair Studio pledged in writing not to make the project public. For consumers, prior consent will be requested if the project or consumer identity is used as a reference." },
        ],
      },
      {
        title: "Article 12. Source Code, Repositories, and Access",
        clauses: [
          { text: "1. If source code forms part of agreed Deliverables, it will be made available upon full payment insofar as permitted under applicable licenses and the Agreement." },
          { text: "2. Open-source or third-party source code is not owned by Voltair Studio and remains subject to applicable license terms." },
          { text: "3. Unless agreed otherwise, generic Voltair Studio boilerplates, component libraries, deployment scripts, and development tools remain part of Voltair Studio's own development environment." },
          { text: "4. Access to a Git repository, hosting environment, deployment environment, database, or other technical environment is provided according to agreements in the quotation or contract." },
          { text: "5. API keys, passwords, environment variables, and other secret credentials are not delivered as general source code and are transferred only if necessary, secure, and agreed in writing." },
          { text: "6. If complete transfer of a project or repository is agreed, the scope and method of transfer will be recorded in writing in advance." },
        ],
      },
      {
        title: "Article 13. Hosting, Domain Names, and Retention Rights",
        clauses: [
          { text: "1. Voltair Studio can supply web hosting and domain registration/management via its hosting packages and infrastructure partners, conform quotation specifications and rates." },
          { text: "2. Unless agreed otherwise in writing, hosting and domain agreements are entered into for an initial period of one (1) year. For Business Clients, these can be extended in accordance with agreed terms. For Consumers, after the first fixed period, if continued, an indefinite agreement applies with a maximum notice period of one month." },
          { text: "3. Voltair Studio strives for maximum availability and security, but does not guarantee uninterrupted availability unless an SLA or result obligation is agreed upon." },
          { text: "4. Insofar as legally permitted, Voltair Studio is not liable for downtime or outages caused entirely by external datacenter, cloud, network, DNS, hosting, or infrastructure providers." },
          { text: "5. A domain name registered on Client's behalf is registered in Client's name unless agreed otherwise in writing. Registration remains subject to the conditions of the relevant registrar and registry." },
          { text: "6. Upon termination, Voltair Studio will, insofar as reasonable and technically feasible, cooperate with domain and file transfer, taking outstanding payment obligations and legal rights into account." },
          { text: "7. Insofar as legally permitted, Voltair Studio may exercise retention rights by suspending work, access to managed environments, or transfer of company files. This leaves Client's ownership and registration rights to its own domain unaffected." },
          { text: "8. After termination of hosting or maintenance, Voltair Studio retains files, databases, and backups for a maximum of 30 calendar days, unless a longer retention period is legally required or necessary for legal claims. Thereafter, they are deleted insofar as legally permitted." },
          { text: "9. Client is responsible for timely securing data if no separate backup service is agreed upon." },
        ],
      },
      {
        title: "Article 14. Hosting, Maintenance, and Periodic Services",
        clauses: [
          { text: "1. Maintenance, updates, support, and periodic work are included only if explicitly specified in the quotation or agreement." },
          { text: "2. Without a maintenance agreement, Voltair Studio is not obliged to process future updates, security updates, framework changes, browser changes, or third-party API changes free of charge." },
          { text: "3. For consumers, an initial fixed duration of maximum one year applies, unless law permits otherwise. Thereafter, if continued, the agreement continues indefinitely with a maximum notice period of one month." },
          { text: "4. For business clients, agreed terms and notice periods from the quotation or contract apply." },
          { text: "5. If periodic rates can be adjusted, applicable adjustment authority and cancellation options will be clearly recorded in advance." },
        ],
      },
      {
        title: "Article 15. External Services, Tools, and APIs",
        clauses: [
          { text: "1. Voltair Studio may use third-party services and APIs during development, including payment providers, external databases, cloud platforms, map services, analytics, SaaS services, and software libraries." },
          { text: "2. Costs for external services not explicitly included in quoted prices are borne by Client if made known in advance or reasonably necessary for Client's requested use." },
          { text: "3. Insofar as legally permitted, Voltair Studio is not liable for damage, delays, or outages directly resulting from changes, outages, termination, restrictions, or price changes at external suppliers." },
          { text: "4. Necessary adjustments due to third-party provider changes may be executed as Additional Work after informing Client." },
          { text: "5. Client is responsible for timely paying subscription costs and complying with terms of external services registered in Client's name." },
        ],
      },
      {
        title: "Article 16. Privacy and Data Processing (GDPR)",
        clauses: [
          { text: "1. Parties act in accordance with applicable privacy legislation, including the GDPR, when processing personal data." },
          { text: "2. Client is responsible for the lawfulness of personal data collected via the developed website or application, unless agreed otherwise in writing." },
          { text: "3. If Voltair Studio processes personal data on Client's behalf as a data processor under the GDPR, parties enter into a data processing agreement containing required statutory provisions." },
          { text: "4. If a separate data processing agreement applies, it prevails over these terms in case of conflict regarding personal data processing." },
          { text: "5. Voltair Studio may use sub-processors or external service providers insofar as lawful and necessary." },
          { text: "6. Client remains responsible for the content and lawfulness of its privacy statement, cookie policy, cookie consent, and other legal texts, unless drafting or legally reviewing them is explicitly agreed as a separate assignment." },
          { text: "7. Voltair Studio does not provide legal advice and does not guarantee that a website fully complies with all applicable laws and regulations, unless a separate advisory assignment is explicitly agreed." },
        ],
      },
      {
        title: "Article 17. Security",
        clauses: [
          { text: "1. Voltair Studio takes reasonable technical measures within the agreed scope to adequately secure systems and data under its management." },
          { text: "2. No system can be guaranteed completely free of security risks." },
          { text: "3. Client is responsible for carefully handling passwords, accounts, API keys, and access credentials on its side." },
          { text: "4. If a security incident arises wholly or partially from acts or omissions of Client or a third party engaged by Client, Voltair Studio is not liable insofar as legally permitted." },
        ],
      },
      {
        title: "Article 18. Liability",
        clauses: [
          { text: "1. Voltair Studio is exclusively liable for direct damage resulting directly from an attributable failure in executing the Agreement, insofar as liability is not legally excluded or limited." },
          { text: "2. For business clients, total liability for direct damage per event or series of connected events is limited to a maximum of the invoice value agreed for the specific assignment concerned / actually paid by the client for that specific assignment." },
          { text: "3. Voltair Studio is explicitly not liable to business clients, insofar as legally permitted, for indirect damage, including but not limited to consequential damage, lost profits, missed savings, loss of data, loss of goodwill, reputational damage, reduced revenue, and business interruption, except in cases of intent or deliberate recklessness by Voltair Studio." },
          { text: "4. Voltair Studio is not liable, insofar as legally permitted, for damage resulting solely from outages, errors, or changes at external suppliers or third-party services chosen by Client." },
          { text: "5. Voltair Studio is not liable for damage arising from inaccurate or incomplete information provided by Client or from modifications made to the website, code, server environment, or configuration by Client or third parties without Voltair Studio's consent." },
          { text: "6. For consumers, statutory liability rules apply, and provisions in this article cannot restrict statutory consumer rights." },
          { text: "7. Limitations of liability do not apply if and insofar as restriction thereof is not permitted under mandatory law, including in cases of intent or deliberate recklessness on the part of Voltair Studio." },
          { text: "8. Client must report damage in writing as soon as possible after discovery. Late reporting does not automatically lead to forfeiture of rights; statutory rules and reasonable interests of both parties remain applicable." },
        ],
      },
      {
        title: "Article 19. Force Majeure",
        clauses: [
          { text: "1. Voltair Studio is not bound to fulfill any obligation if prevented from doing so by a circumstance not reasonably attributable to it." },
          { text: "2. Force majeure includes: disruptions in internet or telecommunications networks, power outages, large-scale DDoS or cyber attacks, government measures, illness of crucial personnel, and defaults by engaged suppliers or upstream cloud providers." },
          { text: "3. If force majeure continues for more than 60 consecutive calendar days, parties have the right to terminate the agreement in writing, insofar as law permits, without obligation to pay damages." },
          { text: "4. Work already performed and non-cancellable costs incurred remain due insofar as legally permitted." },
        ],
      },
      {
        title: "Article 20. Confidentiality",
        clauses: [
          { text: "1. Parties undertake to maintain confidentiality regarding all confidential information obtained in the context of the quotation or collaboration." },
          { text: "2. Information is deemed confidential if explicitly communicated or reasonably apparent from the nature of the information." },
          { text: "3. Confidentiality obligations do not apply to information already public, lawfully obtained from a third party, independently developed, or required to be disclosed by law." },
          { text: "4. This obligation remains in force after termination of the Agreement for as long as reasonably necessary." },
        ],
      },
      {
        title: "Article 21. Complaints",
        clauses: [
          { text: "1. Complaints about work, services, or invoices may be submitted in writing or via email to Voltair Studio." },
          { text: "2. Client must report complaints as soon as possible after discovery to enable Voltair Studio to investigate and, where applicable, remedy the issue in a timely manner." },
          { text: "3. A complaint must contain sufficient information to enable Voltair Studio to assess it." },
          { text: "4. Voltair Studio will respond to a complaint within a reasonable period and seek a solution with Client where possible." },
          { text: "5. Submitting a complaint does not automatically suspend payment obligations." },
          { text: "6. Statutory rights of consumers remain fully applicable." },
        ],
      },
      {
        title: "Article 22. Portfolio and Publicity",
        clauses: [
          { text: "1. Voltair Studio may use completed projects as references in accordance with Article 11." },
          { text: "2. Voltair Studio will not publish confidential information in doing so." },
          { text: "3. If agreed in writing in advance that a project will be treated confidentially or not made public, Voltair Studio will abide by that agreement." },
        ],
      },
      {
        title: "Article 23. Amendments to the General Terms and Conditions",
        clauses: [
          { text: "1. For new agreements, Voltair Studio may amend or supplement these general terms and conditions." },
          { text: "2. For ongoing agreements, amendments will be announced in writing or digitally at least 30 days prior to taking effect. If the amendment is to the disadvantage of Client, Client has the right to object or to terminate the agreement as of the date the amendment takes effect." },
          { text: "3. For consumers, amendments to ongoing agreements are implemented only insofar as legally permitted, not unreasonably onerous, and complying with any information and cancellation requirements." },
          { text: "4. An amended version will be made available to Client in a timely manner when required by law or agreement." },
        ],
      },
      {
        title: "Article 24. Duration and Termination of Business Agreements",
        clauses: [
          { text: "1. The duration of a business agreement is determined in the quotation or agreement." },
          { text: "2. An agreement for a fixed period ends on the agreed end date, unless parties agree otherwise or the agreement is lawfully extended." },
          { text: "3. If automatic extension of a business agreement is agreed, termination must take place with due observance of a notice period of 1 month before the end of the current term, unless specified otherwise in quotation or agreement." },
          { text: "4. An agreement for an indefinite period may be terminated by either party with due observance of the agreed notice period." },
          { text: "5. In the event of a serious failure, the other party may terminate the agreement after giving the defaulting party a reasonable opportunity to remedy the failure, unless remedy cannot reasonably be demanded." },
        ],
      },
      {
        title: "Article 25. Suspension",
        clauses: [
          { text: "1. Voltair Studio may, insofar as legally permitted, suspend its work if client substantially fails to meet a payment or cooperation obligation." },
          { text: "2. Voltair Studio will inform Client in advance about suspension where reasonably possible." },
          { text: "3. Suspension leaves already accrued payment obligations unaffected." },
          { text: "4. Suspension will not be applied in a manner conflicting with mandatory consumer law or unnecessarily preventing access to legally protected personal data." },
        ],
      },
      {
        title: "Article 26. Applicable Law and Competent Court",
        clauses: [
          { text: "1. Dutch law applies to all legal relationships between Voltair Studio and Client." },
          { text: "2. Disputes that cannot be resolved amicably may be submitted to the court having jurisdiction under the law." },
          { text: "3. For business clients, insofar as legally permitted, disputes may be submitted to the competent court in the district where Voltair Studio is officially established." },
          { text: "4. Consumers are not restricted in their right to submit a dispute to the court having mandatory jurisdiction under the law." },
        ],
      },
      {
        title: "Article 27. Final Provisions",
        clauses: [
          { text: "1. If any provision of these general terms and conditions proves invalid, void, or voidable, the remaining provisions remain in full force and effect." },
          { text: "2. Parties shall, if necessary, replace the provision in question with a valid provision approximating the intent of the original provision as much as possible." },
          { text: "3. Voltair Studio's records serve, exclusively with respect to business clients, subject to proof to the contrary, as proof of work performed, payments, and communications, insofar as legally permitted. For consumers, this provision does not apply in accordance with Article 6:237 of the Dutch Civil Code (BW)." },
          { text: "4. These general terms and conditions were established in September 2026 and apply to quotations and agreements to which this version is applicable." },
        ],
      },
    ],
  },
};
