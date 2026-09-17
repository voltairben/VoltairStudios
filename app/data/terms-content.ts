// Algemene Voorwaarden (Terms & Conditions) — direct request, full text
// supplied by the user as a finished legal document (September 2026
// version), transcribed verbatim below, not summarized or edited.
// Dutch-law-specific (cites BW articles, AVG) — English translation
// deliberately not attempted here (see TermsContent.tsx's own
// comment): the user will supply that himself rather than risk a
// machine mistranslation of binding contract terms, same standard
// LEGAL_CONTENT's own placeholder discipline already holds to for
// facts (never fabricate what isn't real yet).
//
// Shape differs from legal-content.ts's LegalContentShape on purpose:
// Privacy is flat paragraphs + one trailing list per section: this
// document is numbered clauses (1., 2., 3.) with two clauses (Artikel
// 3.4, Artikel 6.5) carrying their own lettered a/b/c sub-list
// mid-flow. Forcing that into LegalSection's shape would mean either
// losing the sub-lists or bolting on complexity Privacy doesn't need
// — a small parallel type is the honest fit. Rendering reuses every
// existing .legal-* CSS class as-is (see globals.css) — no new styles.
// Letterhead placeholders ("[KvK-nummer]" etc.) are copied verbatim
// from the source document, not reworded to match legal-content.ts's
// own placeholder phrasing — this is the user's own legal text.

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

export const TERMS_CONTENT: { nl: TermsContentShape; en?: TermsContentShape } = {
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
};
