# Restructure Contentful — source reference (raw)

> Extracted verbatim from `restructure-source.xlsx` (the exact spreadsheet reviewed by
> the Contentful SA, `Restructuring Approval Contentful.csv` per ADR-0005). 69 content
> types, 256 field rows. This is a **literal transcription** — naming/case/typos are
> preserved as-is; see `analysis-notes.md` for the flagged issues.

## 1. Header
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key  | Short Text |  | Top page header configuration that groups navigation, branding, utility links, search, and primary actions. |
| Utility Bar | Reference | UtilityBar | Utility Bar field for Header; references UtilityBar. |
| Logo | Reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| Persona Links | Reference | Link | Link or URL configuration used to navigate users to the correct destination. |
| Search | Reference | InputForms | Search field for Header; references InputForms. |
| CTA | Reference | Button | Call-to-action configuration referencing Button, used for the primary user action. |

## 2. Banner
| Field | Type | Reference | Description |
|---|---|---|---|
| Background Image | Reference | GraphicAsset | Hero/banner section used to display prominent visual branding, page messaging, and supporting logo/title assets. |
| Logo | Reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| Heading | Reference | Heading | Display heading shown to users or editors for this item. |

## 3. Meta
| Field | Type | Reference | Description |
|---|---|---|---|
| Title (40-75 chars) | Short Text |  | SEO metadata for the page including browser title, search description, and keyword targeting. |
| Description (110-160 chars) | Long Text |  | Main supporting copy/content for this item. Long-form formatted content entered by the content author. |
| Keywords | Short Text |  | Keywords field for Meta. Short text value entered directly by the content author. |

## 4. SubNavBar
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key  |  |  | Secondary navigation bar configuration for related page or section links. |
| Links | Reference | LinkSelector | Link or URL configuration used to navigate users to the correct destination. |

## 5. Footer
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key  |  |  | Footer configuration containing brand logo and social or supporting links. |
| Logo |  |  | Visual or file asset used by this item. |
| Social Links | Reference | Link | Link should have asset |

## 6. Component Collection
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Reusable collection container for one or more page components. |
| Component | Reference |  | Component field for Component Collection. References another reusable content entry. |

## 7. RichText
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Container that points to reusable rich text content blocks. |
| Richtext | Reference | RichText Item | Main supporting copy/content for this item. References another reusable content entry. |

## 8. RichText Item
| Field | Type | Reference | Description |
|---|---|---|---|
| RichText |  |  | Reusable formatted text content such as paragraphs, inline links, or HTML-style copy. |

## 9. UtilityBar
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key | Short Text |  | Utility navigation area for language selection, login access, and quick links. |
| Language Dropdown | Reference (one) | SelectorForms | Dropdown/selector configuration referencing SelectorForms. |
| Login Dropdown | Reference (one) | LinkSelector | Dropdown/selector configuration referencing LinkSelector. |

## 10. GraphicAsset
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key | Short Text |  | Reusable image or media asset with accessibility text, sizing, and optional external URL metadata. |
| Asset | Asset Media |  | Visual or file asset used by this item. |
| Alt Text | Short Text |  | Accessibility text describing the asset for screen readers and non-visual users. |
| Aria Label | Short Text |  | ARIA accessibility label used to clarify the control or asset for assistive technology. |
| Width | Number |  | Sizing configuration for layout or display. Numeric value used for ordering, sizing, or configuration. |
| Height | Number |  | Sizing configuration for layout or display. Numeric value used for ordering, sizing, or configuration. |
| Ext Url Link | Long Text |  | Link or URL configuration used to navigate users to the correct destination. |

## 11. Link
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key | Short Text |  | Reusable link record containing display label and destination URL. |
| Link Label | Short Text |  | Link or URL configuration used to navigate users to the correct destination. |
| Url | Long Text |  | Link or URL configuration used to navigate users to the correct destination. |

## 12. InputForms (Text, Number, Email, Text Area, Phone)
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key  | Short Text |  | Form input configuration for text, number, email, textarea, or phone fields including labels, validation, and required state. |
| Label | Short Text |  | Display label shown to users or editors for this item. |
| Alt Text | Short Text |  | Accessibility text describing the asset for screen readers and non-visual users. |
| Aria Label | Short Text |  | ARIA accessibility label used to clarify the control or asset for assistive technology. |
| Type  | Short Text, Dropdown |  | Type field for InputForms (Text, Number, Email, Text Area, Phone). Short text value entered directly by the content author. |
| Placeholder | Short Text |  | Placeholder text shown before the user enters a value. |
| Error Message | Short Text |  | Error message displayed when user input fails validation. |
| Required Field | Boolean |  | Indicates whether this field must be completed before submission. |
| Validations | - |  | Validation rules used to check the submitted field value. |
| Width |  | Dropdown | Sizing configuration for layout or display. General configuration value. |

## 13. ImageWithContent
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Component combining an image with heading, rich text, bullets, and CTA content. |
| Title | Reference | Heading | Display title shown to users or editors for this item. |
| RichTextItem | Reference  | RichText Item | Main supporting copy/content for this item. References another reusable content entry. |
| Bullet Points | Reference | Bullet Points | Bullet Points field for ImageWithContent; references Bullet Points. |
| CTA | Reference | Button | Call-to-action configuration referencing Button, used for the primary user action. |
| Image | Reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |

## 14. BackgroundImageWithContent
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Component that overlays heading, rich text, and links on a background image. |
| Title | Reference | Heading | Display title shown to users or editors for this item. |
| RichTextItem | Reference  | RichText Item | Main supporting copy/content for this item. References another reusable content entry. |
| Link Collection | Reference | Link | Need to check Scenario where image has link |

## 15. Accodian
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Accordion component container used to group expandable accordion list items. |
| Accordian Collection | Reference | Accordian List | Accordian Collection field for Accodian; references Accordian List. |

## 16. Accordian List
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Individual accordion item with title and expandable content. |
| Title |  |  | Display title shown to users or editors for this item. |
| Content | reference | RichText Item,PdfLinkCollection | Main supporting copy/content for this item. References another reusable content entry. |

## 17. Communication Channels
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Section for grouping communication or contact channel details. |
| Details | reference | Icon Text | Details field for Communication Channels; references Icon Text. |

## 18. Icon Text
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Reusable icon-and-text content item combining an icon, heading, and supporting content. |
| Title | reference | Heading | Display title shown to users or editors for this item. |
| Icon | reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| Content | reference | Link, Rich text Item | Main supporting copy/content for this item. References another reusable content entry. |

## 19. SplitContentBlocks
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Container for split-layout content blocks such as login cards, content panels, or PDF cards. |
| Block | reference | Login Card, Content,ContentWithPDFCard | Block field for SplitContentBlocks; references Login Card, Content,ContentWithPDFCard. |

## 20. Content
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Generic content block with heading, description, bullets, and CTA. |
| Title | reference | Heading | Display title shown to users or editors for this item. |
| Description | reference | RichText Item | Main supporting copy/content for this item. References another reusable content entry. |
| Bullet Points | reference | Bullet Points | Bullet Points field for Content; references Bullet Points. |
| CTA | reference | Button | Call-to-action configuration referencing Button, used for the primary user action. |

## 21. MobileAppDownload
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Mobile app promotion/download section with app image, text, and download links. |
| Image Type | reference | Dropdown | Visual or file asset used by this item; expected reference: Dropdown. |
| Title | reference | Heading | Display title shown to users or editors for this item. |
| Description | reference | RichText Item | Main supporting copy/content for this item. References another reusable content entry. |
| Asset | reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| Links | reference | link | Link or URL configuration used to navigate users to the correct destination. |

## 22. TeleDentistry
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | TeleDentistry content section with heading, description, and related card collection. |
| Title | reference | Heading | Display title shown to users or editors for this item. |
| Description | reference | RichText Item | Main supporting copy/content for this item. References another reusable content entry. |
| Cards collection | reference | Cards Collection | Cards collection field for TeleDentistry; references Cards Collection. |

## 23. ImageDescriptionCard
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Card combining an image and descriptive rich text. |
| Image | reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| Description | reference | RichText Item | Main supporting copy/content for this item. References another reusable content entry. |

## 24. IconWithContentCard
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Card combining an icon/image, title, and descriptive rich text. |
| Image | reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| Title | reference | Heading | Display title shown to users or editors for this item. |
| Description | reference | RichText Item | Main supporting copy/content for this item. References another reusable content entry. |

## 25. PdfLinkCard
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Card linking to a PDF document and related document/external icons. |
| Link | reference | Link | Link or URL configuration used to navigate users to the correct destination. |
| Asset | reference | Document Asset | Visual or file asset used by this item; expected reference: Document Asset. |
| Document Icon | reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| External Icon | reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |

## 26. PdfLinkCollection
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Collection of PDF link cards with an optional label or heading. |
| Label | reference  | Heading | Display label shown to users or editors for this item. |
| PdfLinkCards | Reference | PdfLinkCard | Link or URL configuration used to navigate users to the correct destination. |

## 27. Document Asset
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Reusable document file asset with title, file reference, and language metadata. |
| Title |  |  | Display title shown to users or editors for this item. |
| File |  | Asset | File field for Document Asset; references Asset. |
| Language Dropdown |  |  | Dropdown/selector configuration. |

## 28. DynamicDropdown
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Dynamic dropdown block that can drive PDF collections or accordion content based on selected values. |
| Label |  |  | Display label shown to users or editors for this item. |
| Description |  |  | Main supporting copy/content for this item. General configuration value. |
| Dropdown | Reference | SelectorForms | Dropdown/selector configuration referencing SelectorForms. |
| PdfLinkCollection | Reference | PdfLinkCollection, AccordionList | Link or URL configuration used to navigate users to the correct destination. |

## 29. StateContactInfo
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | State-specific contact information section with title, left/right contact areas, and bottom message. |
| Title | Reference | heading | Display title shown to users or editors for this item. |
| Left Column | reference | Contact Column | Left Column field for StateContactInfo; references Contact Column. |
| Right Column | reference | Contact Address | Right Column field for StateContactInfo; references Contact Address. |
| Bottom Message | reference | richtext item | Bottom Message field for StateContactInfo; references richtext item. |

## 30. Contact column
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Contact detail column for label, phone number, clickability, and divider display. |
| Label | short text |  | Display label shown to users or editors for this item. |
| Phone Number | short text |  | Phone number value or phone contact configuration. |
| Is Clickable | boolean |  | Is Clickable field for Contact column. True/false setting that controls behavior or visibility. |
| Divider After | boolean |  | Divider After field for Contact column. True/false setting that controls behavior or visibility. |

## 31. Contact Address
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Postal address details including company, street, city, state, and ZIP code. |
| Company name | short text |  | Company name field for Contact Address. Short text value entered directly by the content author. |
| Address line 1 | short text |  | Address information used for contact or location display. |
| City | short text |  | Address information used for contact or location display. |
| State | short text |  | Address information used for contact or location display. |
| Zipcode | short text |  | Address information used for contact or location display. |

## 32. SecureDocumentPortal
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key  |  |  | Secure document portal section with heading, description, hero image, form configuration, and success message. |
| Heading | reference | heading | Display heading shown to users or editors for this item. |
| Description | reference | rich text item | Main supporting copy/content for this item. References another reusable content entry. |
| Hero Image | reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| Form Config | reference | inputForms | Form Config field for SecureDocumentPortal; references inputForms. |
| Success Content | short text |  | Main supporting copy/content for this item. Short text value entered directly by the content author. |

## 33. SecureDocumentContent
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Secure document content section containing heading, description, and supporting content items. |
| Heading | reference  | heading | Display heading shown to users or editors for this item. |
| Description | reference | richtextitem | Main supporting copy/content for this item. References another reusable content entry. |
| Items | reference  | content item  | Items field for SecureDocumentContent; references content item. |

## 34. Content Item
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Reusable content item with heading, optional subheading, and rich text description. |
| Heading | reference  | heading | Display heading shown to users or editors for this item. |
| Sub Heading | Short text |  | Sub Heading field for Content Item. Short text value entered directly by the content author. |
| Description | reference | rich text item | Main supporting copy/content for this item. References another reusable content entry. |

## 35. GlobalSearch
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Global search component with heading and form configuration. |
| Heading |  |  | Display heading shown to users or editors for this item. |
| Form Config | reference  | inputforms | Form Config field for GlobalSearch; references inputforms. |

## 36. LoginCard
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Login card component with heading, description, CTA, and width/display configuration. |
| Heading | reference | heading | Display heading shown to users or editors for this item. |
| Description | reference  | richtext | Main supporting copy/content for this item. References another reusable content entry. |
| Cta | reference | button | Call-to-action configuration referencing button, used for the primary user action. |
| Width | dropdown |  | Sizing configuration for layout or display. Controlled selection chosen from predefined options. |

## 37. ImageWithContentCTA
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Image-based CTA component linking a hero image with content item copy. |
| Hero Image | reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| Description | reference  | content item  | Main supporting copy/content for this item. References another reusable content entry. |

## 39. InfoContentCard
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Informational card using content item text and supporting icons. |
| Description | reference | content item  | Main supporting copy/content for this item. References another reusable content entry. |
| Icons | reference  | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |

## 40. Accrediations
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Accreditation section listing linked accreditation images or badges. |
| Title | reference | heading | Display title shown to users or editors for this item. |
| Accrediations | reference | ImageWithLink | accrediations field for Accrediations; references ImageWithLink. |

## 41. ImageWithLink
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Image asset paired with descriptive rich text and link behavior. |
| Asset | reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| Description | reference | rich text item | Main supporting copy/content for this item. References another reusable content entry. |

## 42. BrushSection
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Brush-style layout section with left and right content areas. |
| Heading |  |  | Display heading shown to users or editors for this item. |
| Left Content | reference | GraphicAsset | Main supporting copy/content for this item. References another reusable content entry. |
| Right Content | reference | card collection,graphicAsset | Main supporting copy/content for this item. References another reusable content entry. |

## 43. BrushCard
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Small brush card item with icon and title. |
| Icon | reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| Title | short text |  | Display title shown to users or editors for this item. |

## 44. BrokerPlanCard
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Broker plan card with heading, description, selectable collection, and footer content. |
| Heading | reference | heading | Display heading shown to users or editors for this item. |
| Description | reference | rich text item | Main supporting copy/content for this item. References another reusable content entry. |
| Collection |  | Selection Collection | Collection field for BrokerPlanCard; references Selection Collection. |
| Footer Content |  |  | Main supporting copy/content for this item. General configuration value. |

## 45. Selection Collection
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Selectable item configuration with internal name, icon, and target value. |
| Internal Name | Short text |  | Internal Name field for Selection Collection. Short text value entered directly by the content author. |
| Trailing Icon | reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| Target | short text |  | Target field for Selection Collection. Short text value entered directly by the content author. |

## 46. LeadershipCard
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Leadership section that displays a collection of people. |
| Heading |  |  | Display heading shown to users or editors for this item. |
| Person Collection | reference | Person | Person Collection field for LeadershipCard; references Person. |

## 47. Person
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Person profile record with name, designation, image, and display order. |
| Name | Short text |  | Display name shown to users or editors for this item. |
| Designation | S T |  | Designation field for Person. S T field configuration. |
| Profile Image | reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| Display Order | Number |  | Numeric order controlling where this item appears in a list. |

## 48. IFrameContent
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Embedded iframe content section with title and iframe URL. |
| Title | reference | heading | Display title shown to users or editors for this item. |
| Iframe URL | short text |  | Link or URL configuration used to navigate users to the correct destination. |

## 49. ContentWithBackgroundColor
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Content section with heading, description, bullets, and configurable background color. |
| Title | reference | heading | Display title shown to users or editors for this item. |
| Description | reference | rich text item | Main supporting copy/content for this item. References another reusable content entry. |
| Bullet points | reference | bullet points | bullet points field for ContentWithBackgroundColor; references bullet points. |
| Background color | color picker |  | Visual styling configuration for this component. |

## 50. ContentWithPDFCard
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Content section that includes a heading, description, and PDF link card. |
| Title | reference | Heading | Display title shown to users or editors for this item. |
| Description | reference | rich text item | Main supporting copy/content for this item. References another reusable content entry. |
| PDF | reference | PdfLinkCard | PDF field for ContentWithPDFCard; references PdfLinkCard. |

## 51. NewsArticles
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | News article listing section with title, description, form configuration, and article collection. |
| Title |  |  | Display title shown to users or editors for this item. |
| Description | reference |  | Main supporting copy/content for this item. References another reusable content entry. |
| Form Config | reference | inputForms | Form Config field for NewsArticles; references inputForms. |
| Collection | reference | New Articles Collection | Collection field for NewsArticles; references New Articles Collection. |

## 52. New Articles Collection
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Individual article collection entry with title, content, and CTA. |
| Title |  |  | Display title shown to users or editors for this item. |
| Content | reference | rich text item,heading | Main supporting copy/content for this item. References another reusable content entry. |
| Cta | reference | button | Call-to-action configuration referencing button, used for the primary user action. |

## 53. ImageWithCTACard
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Card combining a title, hero image, and CTA. |
| Title | reference | heading | Display title shown to users or editors for this item. |
| Hero image | reference | graphicAsset | Visual or file asset used by this item; expected reference: graphicAsset. |
| CTA | reference | Button | Call-to-action configuration referencing Button, used for the primary user action. |

## 54. ContentWithQR
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Content section containing heading and a related QR/action collection. |
| Heading |  |  | Display heading shown to users or editors for this item. |
| Collection | reference |  | Collection field for ContentWithQR. References another reusable content entry. |

## 55. ActionCollection
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key | - | - | Collection of action cards with display style, theme, and component configuration. |
| Heading | Text | - | Display heading shown to users or editors for this item. |
| Description | Rich Text | - | Main supporting copy/content for this item. Long-form formatted content entered by the content author. |
| Actions | Reference (Multiple) | ActionCard | Actions field for ActionCollection; references ActionCard. |
| Display Style | Dropdown | - | Display Style field for ActionCollection; references -. |
| Theme | Reference | Theme | Visual styling configuration for this component. |
| Configuration | Reference | ComponentConfiguration | Configuration field for ActionCollection; references ComponentConfiguration. |

## 56. ActionCard
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key | - | - | Action card with title, description, media, contact information, links, CTA, and display order. |
| Title | Text | - | Display title shown to users or editors for this item. |
| Description | Rich Text | - | Main supporting copy/content for this item. Long-form formatted content entered by the content author. |
| Icon | Reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| Image | Reference | GraphicAsset | Visual or file asset used by this item; expected reference: GraphicAsset. |
| Contact Information | Reference | ContactInformation | Contact Information field for ActionCard; references ContactInformation. |
| Links | Reference (Multiple) | Link | Link or URL configuration used to navigate users to the correct destination. |
| CTA | Reference | Button | Call-to-action configuration referencing Button, used for the primary user action. |
| Display Order | Number | - | Numeric order controlling where this item appears in a list. |

## 57. ContactInformation
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key | - | - | Reusable contact information record for phone, email, fax, or address details. |
| Label | Text | - | Display label shown to users or editors for this item. |
| Value | Text | - | Value field for ContactInformation; references -. |
| Description | Rich Text | - | Main supporting copy/content for this item. Long-form formatted content entered by the content author. |
| Type | Dropdown | Phone / Email / Fax / Address | Type field for ContactInformation; references Phone / Email / Fax / Address. |

## 58. BannerNotification
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry key |  |  | Dismissible or timed banner notification with description, color, dates, and icon. |
| Description | reference | rich text item | Main supporting copy/content for this item. References another reusable content entry. |
| Banner color | Color picker |  | Visual styling configuration for this component. |
| Show notification or not |  |  | Show notification or not field for BannerNotification. General configuration value. |
| Active from |  |  | Date setting controlling when this item is active or visible. |
| Active to |  |  | Date setting controlling when this item is active or visible. |
| Icon |  |  | Visual or file asset used by this item. |

## 59. URL Redirection
| Field | Type | Reference | Description |
|---|---|---|---|
| Route name |  |  | URL redirect rule defining route name, destination URL, and redirect type. |
| URL |  |  | Link or URL configuration used to navigate users to the correct destination. |
| Redirection Type |  |  | Redirection Type field for URL Redirection. General configuration value. |

## 60. BackgroundSurvey
_(no fields defined)_

## 61. AccessibilitySurvey
_(no fields defined)_

## 62. DynamicForms
_(no fields defined)_

## 63. GrievanceAddress
_(no fields defined)_

## 64. GrievanceLinks
_(no fields defined)_

## 65. Tab
_(no fields defined)_

## 66. BaseCardComponent
_(no fields defined)_

## 67. Page
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Page-level content model connecting metadata, header, breadcrumbs, components, and footer. |
| Meta | reference | Meta | Meta field for Page; references Meta. |
| Header | reference | Header | Header field for Page; references Header. |
| Breadcrumbs | reference | breadcrumbs | breadcrumbs field for Page; references breadcrumbs. |
| Subnavbar | reference | Sub nav bar | subnavbar field for Page; references Sub nav bar. |
| Component | reference | all the components | Component field for Page; references all the components. |
| Footer | reference | footer | Footer field for Page; references footer. |

## 68. DynamicTabs
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Dynamic tab container with dropdown selectors and tab content. |
| Dropdowns | Reference | SelectorForms | Dropdown/selector configuration referencing SelectorForms. |
| Tabs | Reference | Tab | Tabs field for DynamicTabs; references Tab. |

## 69. Tab
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Tab item with label and associated content reference. |
| Label |  |  | Display label shown to users or editors for this item. |
| Content | Reference | DynamicForms, GrievanceAddress, GrievanceLinks,  | Main supporting copy/content for this item. References another reusable content entry. |

## 70. Heading
| Field | Type | Reference | Description |
|---|---|---|---|
| Entry Key |  |  | Reusable heading content type used to manage page or component headings consistently. |
| Title |  |  | Display title text shown as the heading content. |
| Heading Level | dropdown |  | Dropdown selection that defines the semantic heading level, such as H1, H2, or H3. |
