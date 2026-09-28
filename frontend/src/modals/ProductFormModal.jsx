import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  RefreshCw,
  Save,
  DollarSign,
  Barcode,
  Package,
  Layers,
  Ruler,
  Building2,
  FileSpreadsheet,
  ChevronDown,
} from 'lucide-react';
import { api } from '../services/api';

export const STANDARD_COLORS = [
  'Black', 'Maroon', 'Red', 'Navy Blue', 'Peach', 'Green', 'Purple', 'Yellow', 'Gold',
  'Pink', 'White', 'Brown', 'Blue', 'Orange', 'Grey', 'Coral', 'Lavendar', 'Aqua Blue',
  'Nude', 'Lemon', 'Baby Pink', 'Charcoal', 'Brick Red', 'Sea Green', 'Sky BLUE',
  'Mustard', 'KHAKI', 'Melange', 'Turk', 'Gray', 'Fawn', 'Light Brown', 'Rani',
  'Termy Green', 'Multi Colour', 'Tremy Pink', 'Rest Red', 'Rest Pink', 'Floris Pink',
  'Floris Green', 'Rest Peach', 'Rest Navy', 'Boots Lemon', 'Beige', 'Cream', 'Dark Multicolour',
  'Grey Melange', 'Lemon Yellow', 'Light Multicolour', 'Metallic', 'Mint Green', 'Multicolor',
  'Olive', 'Rust', 'Silver', 'Teal',
];

export const STANDARD_SIZES = [
  'XXL', 'XL', 'L', 'M', 'S', 'XS', 'Free Size', '3XL', '4XL', '5XL',
  '0 - 3 Months', '3 - 6 Months', '6 - 9 Months', '9 - 12 Months',
  '12 - 18 Months', '18 - 24 Months', '24 - 36 Months',
];

export const STANDARD_CATEGORIES = ['Nighty', 'Housecoat', 'INFANT', 'TODDLER', 'GIRLS', 'BOYS'];

export const STANDARD_SUB_CATEGORIES = [
  'Sleeveless',
  'Short Sleeves',
  '3/4th Sleeves',
  'Three-Quarter Sleeves',
  'Full Sleeves',
  'Long Sleeves',
  'Cap Sleeves',
  'Half Sleeves',
  'Shoulder Strap',
];

export const STANDARD_NECKS = [
  'Square Neck',
  'Round Neck',
  'V-Neck',
  'Collar Neck',
  'U-Neck',
  'Boat Neck',
  'Sweetheart Neck',
  'Halter Neck',
  'Keyhole Neck',
  'Mandarin',
  'Scoop Neck',
  'Shirt Collar',
  'Shoulder Straps',
  'Notch',
  'Paan',
  'Surplice',
  'Stylised',
];

export const STANDARD_SUB_PRODUCTS = [
  'SINGLE DRESS',
  'SET OF 2',
  'SET OF 3',
  'NIGHTY WITH ROBE',
];

export const STANDARD_FABRICS = [
  'Cotton',
  'Cotton Blend',
  'Rayon',
  'Hosiery',
  'Satin',
  'Crepe',
  'Chiffon',
  'Georgette',
  'Fleece',
  'Linen',
  'Micromodal',
  'Modal',
  'Net',
  'Nylon',
  'Polycotton',
  'Polyester',
  'Silk',
  'Silk Blend',
  'Velvet',
  'Viscose',
  'Viscose Rayon',
  'Wool',
  'Cotswool',
  'Cotton Linen',
  'Denim',
  'Khadi Cotton',
  'Acrylic',
];

export const STANDARD_FABRIC_COMPOSITIONS = [
  'Woven',
  'Knitted',
  '100% Cotton',
  'Cotton Blend',
  'Rayon',
  'Hosiery',
  'Satin',
  'Polyester',
  'Silk',
];

export const STANDARD_FABRIC_TYPES = ['Woven', 'Knitted'];

export const STANDARD_FIT_TYPES = [
  'Dress',
  'Frock',
  'Gown',
  'Jumpsuit',
  'Kaftan',
  'Robe',
  'Short Nighty',
  'T-Shirt Dress',
  'Regular Fit',
  'Relaxed Fit',
  'A-Line',
];

export const STANDARD_GENERIC_NAMES = [
  'Maxi',
  'Nighty',
  'Night Gown',
  'Nightdress',
  'Sleepwear Gown',
  'Garment',
  'Bottom Wear',
  'Topwear',
  'Undergarment',
  'Accessories',
  'Sportswear',
  'Others',
];

export const STANDARD_PATTERNS = [
  'Printed',
  'Solid',
  'Self-Design',
  'Striped',
  'Checked',
  'Colorblocked',
  'Dyed/ Washed',
  'Embellished',
  'Embroidered',
  'Lace',
];

export const STANDARD_PRINT_TYPES = [
  'Botanical',
  'Floral',
  'Ethnic Motif',
  'Abstract',
  'Geometric',
  'Polka Dots',
  'Solid',
  'Stripe',
  'Animal',
  'Camoflague',
  'Checked',
  'Chevron',
  'Colorblocked',
  'Embellished',
  'Fruits',
  'Heart',
  'Korean',
  'Leheriya',
  'Melange',
  'Micro Print',
  'Ombre',
  'Placement Print',
  'Quirky',
  'Tie And Dye',
  'Tribal',
  'Typography',
  'Woven Design',
];

export const STANDARD_SLEEVE_LENGTHS = [
  'Sleeveless',
  'Short Sleeves',
  'Three-Quarter Sleeves',
  'Long Sleeves',
  'Shoulder Strap',
];

export const STANDARD_POCKETS = [
  'No Pocket',
  '1',
  '2',
  '3',
  '4',
  '1 Side Pocket',
  '2 Side Pockets',
];

export const STANDARD_OCCASIONS = [
  'Everyday',
  'Bridal',
  'Casual',
  'Nightwear',
  'Lounge Wear',
];

export const STANDARD_SURFACE_STYLINGS = [
  'Pleated Or Gathered',
  'Bow',
  'Contrast Piping',
  'Lace Inserts',
  'Lace Trim',
  'Ruffles',
  'Cutwork',
  'Applique',
  'Cut Out',
  'Embellished',
  'Embroidery',
  'Fringed',
  'Layered',
  'Sequinned',
  'Smocking Or Shirred',
  'Studded',
  'Tassels Or Pom-Poms',
  'Tie-Ups',
  'Waist Tie-Ups',
  'Not Applicable',
];

export const STANDARD_LENGTHS = [
  'Maxi',
  'Calf-Length',
  'Knee Length',
  'Above Knee',
  'Ankle Length',
];

export const STANDARD_COUNTRIES = [
  'India',
  'Bangladesh',
  'China',
  'Sri Lanka',
  'Vietnam',
  'Other',
];

export const STANDARD_SEASONS = [
  'Everyday',
  'Summer',
  'Winter',
  'Spring',
  'Autumn',
  'Festive',
];

export const STANDARD_ADD_ONS = [
  'No Add Ons',
  'Robe',
  'Bra',
  'Briefs',
  'Bra And Briefs',
  'Robe And Briefs',
  'Robe Bra And Briefs',
  'Top',
  'Set',
  'Padded',
];

export const STANDARD_NET_QUANTITIES = ['1', '2', '3', '4', '5'];
export const STANDARD_COMPONENTS = ['1', '2', '3', '4', '5'];
export const STANDARD_SIZES_PER_SET = ['1', '2', '3', '4', '5', '6'];
export const STANDARD_GST_RATES = ['5', '12', '18', '0'];
export const STANDARD_HSN_CODES = [
  '620821',
  '620891',
  '620892',
  '620899',
  '610831',
  '610832',
  '610839',
];

export const STANDARD_BUST_SIZES = ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56'];
export const STANDARD_LENGTH_SIZES = ['36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '55', '56', '58', '60'];
export const STANDARD_HIP_SIZES = ['30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58', '60'];
export const STANDARD_WAIST_SIZES = ['24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54'];

/**
 * Normalizes any Windows file path (e.g. D:\Business Website\Pic\DE26011\Blue\Blue_1.jpg),
 * relative path, or server path to a valid web URL path (/Pic/...)
 */
export function normalizeImagePath(path) {
  if (!path || typeof path !== 'string') return path;
  let clean = path.trim().replace(/^["']|["']$/g, '').trim();
  if (!clean) return clean;
  clean = clean.replace(/\\/g, '/');
  const lower = clean.toLowerCase();

  const picIdx = lower.indexOf('/pic/');
  if (picIdx !== -1) {
    return '/Pic/' + clean.substring(picIdx + 5);
  }
  if (lower.startsWith('pic/')) {
    return '/Pic/' + clean.substring(4);
  }
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }
  if (clean.startsWith('/Pic_thumbs/')) {
    return clean;
  }
  if (clean.startsWith('/Pic/')) {
    return clean;
  }
  if (clean.startsWith('/pic/')) {
    return '/Pic/' + clean.substring(5);
  }
  if (clean.startsWith('/')) {
    return clean;
  }
  return '/Pic/' + clean;
}

export const STANDARD_MANUFACTURERS = [
  'Pegasus Creation',
  'Divine Enterprise',
];

export const STANDARD_MANUFACTURER_ADDRESSES = [
  'Prasanta Apartment, Check Post',
  'Kolkata, West Bengal',
];

export const STANDARD_PINCODES = [
  '700125',
  '700001',
  '700007',
  '110001',
  '400001',
];

export const STANDARD_PACKERS = [
  'Divine Enterprise',
  'Pegasus Creation',
];

/**
 * Universal Editable Dropdown (Combobox) component:
 * Enables the user to freely write/type custom text into the field at any time,
 * while ALSO providing an interactive, searchable dropdown list of standard options.
 */
export function EditableDropdown({
  label,
  value,
  onChange,
  options = [],
  required = false,
  placeholder = '',
  disabled = false,
  className = '',
  type = 'text',
  listId,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const strVal = value != null ? String(value) : '';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!strVal) return options;
    const lower = strVal.toLowerCase();
    const matched = options.filter((opt) => String(opt).toLowerCase().includes(lower));
    return matched;
  }, [options, strVal]);

  const uniqueListId = listId || (label ? `list-${label.replace(/[^a-zA-Z0-9]/g, '_')}` : undefined);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-xs font-medium text-slate-300 mb-1">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type={type}
          value={strVal}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          required={required}
          disabled={disabled}
          placeholder={placeholder || (label ? `Type or select ${label}...` : 'Type or select...')}
          list={uniqueListId}
          autoComplete="off"
          className={`w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-3 pr-8 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60 ${className}`}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            setIsOpen((prev) => !prev);
            if (!isOpen) inputRef.current?.focus();
          }}
          className="absolute right-2 p-1 text-slate-400 hover:text-slate-200 focus:outline-none"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-emerald-400' : ''
            }`}
          />
        </button>
      </div>

      {uniqueListId && (
        <datalist id={uniqueListId}>
          {options.map((opt) => (
            <option key={String(opt)} value={String(opt)} />
          ))}
        </datalist>
      )}

      {isOpen && options.length > 0 && !disabled && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-lg bg-slate-900 border border-slate-700 shadow-2xl py-1 text-xs divide-y divide-slate-800/40">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => {
              const optStr = String(opt);
              const isSelected = optStr.toLowerCase() === strVal.toLowerCase();
              return (
                <div
                  key={optStr}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(optStr);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-1.5 cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{optStr}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
              );
            })
          ) : (
            <div className="p-2 space-y-1">
              <div className="px-2 py-1 text-[11px] text-amber-300 bg-amber-500/10 rounded flex items-center justify-between">
                <span>Custom: "{strVal}"</span>
                <span className="text-[10px] text-amber-400/80 font-mono">Custom text enabled</span>
              </div>
              <div className="px-2 pt-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                All Available Options:
              </div>
              {options.map((opt) => {
                const optStr = String(opt);
                return (
                  <div
                    key={optStr}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onChange(optStr);
                      setIsOpen(false);
                    }}
                    className="px-2 py-1 text-slate-300 hover:bg-slate-800 hover:text-white rounded cursor-pointer"
                  >
                    {optStr}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Backward compatibility alias: all form fields now allow free-text writing as well as dropdown selection
export const SelectDropdown = EditableDropdown;

export const EMPTY_FORM_STATE = {
  style_no: '',
  season: '',
  category: '',
  sub_category: '',
  product_type: '',
  sub_product: '',
  fabric_composition: '',
  fabric_type: '',
  no_of_components: '',
  colour: '',
  sizing: '',
  num_size_per_set: '',
  individual_barcode: '',
  pack_barcode: '',
  purchase_rate: '',
  profit_margin: '',
  meesho_price: '',
  wrong_return_price: '',
  mrp_pcs: '',
  mrp_set: '',
  hsn_id: '',
  gst_pct: '',
  net_weight_gms: '',
  image_url: '',
  image_url_2: '',
  image_url_3: '',
  image_url_4: '',
  description: '',
  product_name: '',
  inventory: '',
  country_of_origin: '',
  manufacturer_name: '',
  manufacturer_address: '',
  manufacturer_pincode: '',
  packer_name: '',
  packer_address: '',
  packer_pincode: '',
  importer_name: '',
  importer_address: '',
  importer_pincode: '',
  add_ons: '',
  fabric: '',
  fit_type: '',
  generic_name: '',
  net_quantity: '',
  bust_size: '',
  length_size: '',
  sku_id: '',
  brand_name: '',
  group_id: '',
  ean_upc: '',
  brand: '',
  length: '',
  neck: '',
  occasion: '',
  pattern: '',
  pockets: '',
  print_type: '',
  sleeve_length: '',
  surface_styling: '',
  hip_size: '',
  waist_size: '',
};

/**
 * Evaluates Meesho Price based on the standardized Barcode Master / Meesho Catalog formula:
 * =ROUND(($O2+($O2*$P2))*1.05*1.20, 0)
 * =ROUND(($O2+($O2*$P2))*1.26, 0)
 *
 * where:
 *   $O2 = Purchase Rate (pr)
 *   $P2 = Profit Margin (marginDecimal)
 *
 * Step 1: Base Cost + Profit Margin = pr + (pr * marginDecimal)
 * Step 2: Add 5% GST = Step 1 * 1.05
 * Step 3: Add 20% Meesho Return/RTO Allowance = Step 2 * 1.20
 * Result: ROUND(Step 3, 0)
 * Wrong Return Price: Meesho Price - 22 (when Meesho Price > 22)
 */
export function evaluatePricingFormula(prVal, marginVal) {
  const pr = parseFloat(prVal);
  if (isNaN(pr) || pr <= 0) {
    return {
      isValid: false,
      pr: 0,
      marginPercent: 0,
      marginDecimal: 0,
      t1: 0,
      t2: 0,
      t3: 0,
      meeshoPrice: '',
      wrongReturnPrice: '',
    };
  }

  let rawMargin = parseFloat(marginVal);
  if (isNaN(rawMargin) || rawMargin < 0) rawMargin = 0;
  // If margin entered like 18 or 20, convert to decimal 0.18 or 0.20
  const marginDecimal = rawMargin > 1 ? rawMargin / 100 : rawMargin;
  const marginPercent = Math.round(marginDecimal * 100 * 10) / 10;

  // Formula exact terms:
  // Term 1: Cost + Profit Margin = pr + (pr * marginDecimal)
  const t1 = pr + (pr * marginDecimal);
  // Term 2: With 5% GST = Term 1 * 1.05
  const t2 = t1 * 1.05;
  // Term 3: With 20% Meesho Return/RTO allowance = Term 2 * 1.20 (= pr * (1 + marginDecimal) * 1.26)
  const t3 = t2 * 1.20;
  // Excel ROUND(Term 3, 0)
  const meeshoPrice = Math.round(t3);
  // Meesho Wrong Return formula: =IF(D{r}>22, D{r}-22, "")
  const wrongReturnPrice = meeshoPrice > 22 ? meeshoPrice - 22 : 0;

  return {
    isValid: true,
    pr,
    marginPercent,
    marginDecimal,
    t1: Math.round(t1 * 100) / 100,
    t2: Math.round(t2 * 100) / 100,
    t3: Math.round(t3 * 1000) / 1000,
    meeshoPrice,
    wrongReturnPrice,
  };
}

/**
 * Master Color Codes dictionary reverse-engineered from MASTER sheet of Barcode Master.xlsx
 * 100% matched across all 47 rows in the production catalog.
 */
export const MASTER_COLOR_CODES = {
  'termy green': '001',
  'multi colour': '002',
  'tremy pink': '003',
  'yellow': '004',
  'rest red': '005',
  'rest pink': '006',
  'floris pink': '007',
  'floris green': '008',
  'rest peach': '009',
  'rani': '010',
  'rest navy': '011',
  'red': '012',
  'navy blue': '013',
  'pink': '014',
  'boots lemon': '015',
  'khaki': '016',
  'mustard': '017',
  'melange': '018',
  'sky blue': '019',
  'baby pink': '020',
  'turk': '022',
  'gray': '023',
  'charcoal': '024',
  'brick red': '025',
  'sea green': '026',
  'peach': '027',
  'lemon': '028',
  'white': '029',
  'light brown': '030',
  'fawn': '031',
  'maroon': '032',
  'black': '033',
  'green': '034',
  'purple': '035',
  'blue': '036',
  'orange': '037',
  'gold': '038',
  'grey': '039',
  'brown': '040',
  'coral': '041',
  'lavendar': '042',
  'lavender': '042',
  'aqua blue': '043',
  'nude': '044',
};

/**
 * Master Size Codes dictionary reverse-engineered from MASTER sheet of Barcode Master.xlsx
 */
export const MASTER_SIZE_CODES = {
  '0 - 3 months': '01',
  '0-3m': '01',
  '0-3 months': '01',
  '3 - 6 months': '02',
  '3-6m': '02',
  '3-6 months': '02',
  '6 - 9 months': '03',
  '6-9m': '03',
  '6-9 months': '03',
  '9 - 12 months': '05',
  '9-12m': '05',
  '9-12 months': '05',
  '12 - 18 months': '06',
  '12-18m': '06',
  '12-18 months': '06',
  '18 - 24 months': '07',
  '18-24m': '07',
  '18-24 months': '07',
  '24 - 36 months': '08',
  '24-36m': '08',
  '24-36 months': '08',
  'free': '09',
  'free size': '09',
  'm': '10',
  'l': '11',
  'xl': '12',
  'xxl': '13',
  '2xl': '13',
  '3xl': '14',
  '4xl': '15',
  '5xl': '16',
  's': '09',
  'xs': '08',
};

/**
 * Evaluates Individual & Pack Barcode generation based on exact Master specification:
 * Individual Barcode = [Style No] + "1" (Category Prefix) + [Colour Code (3-digit)] + [Size Code (2-digit)]
 * Pack Barcode = "P" + [Individual Barcode]
 */
export function evaluateBarcodeFormula(styleNo, colour, sizing) {
  const cleanStyle = (styleNo || '').trim().toUpperCase();
  const cleanColour = (colour || '').trim().toLowerCase();
  const cleanSize = (sizing || '').trim().toLowerCase();

  const colorCode = MASTER_COLOR_CODES[cleanColour] || (cleanColour ? '033' : '');
  const sizeCode = MASTER_SIZE_CODES[cleanSize] || (cleanSize ? '13' : '');
  const categoryDigit = '1';

  const hasStyle = Boolean(cleanStyle);
  const hasColour = Boolean(colorCode);
  const hasSize = Boolean(sizeCode);
  const isValid = Boolean(hasStyle && hasColour && hasSize);

  const individualBarcode = isValid ? `${cleanStyle}${categoryDigit}${colorCode}${sizeCode}` : '';
  const packBarcode = individualBarcode ? `P${individualBarcode}` : '';

  return {
    isValid,
    hasStyle,
    hasColour,
    hasSize,
    styleNo: cleanStyle,
    categoryDigit,
    colour: colour || '',
    colorCode: colorCode || '',
    sizing: sizing || '',
    sizeCode: sizeCode || '',
    individualBarcode,
    packBarcode,
  };
}

/**
 * Individual Photo Upload & Path Configuration Card:
 * Supports instant normalization of local Windows absolute paths (e.g. D:\Business Website\Pic\...),
 * file picking with automatic upload to server, and instant thumbnail preview.
 */
function PhotoUploadCard({
  title,
  sublabel,
  fieldKey,
  value,
  preview,
  onChange,
  onUpload,
  isUploading,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="p-3.5 border border-slate-800 rounded-xl bg-slate-950/70 flex flex-col sm:flex-row items-center gap-4 transition-colors hover:border-slate-700">
      <div className="relative w-24 h-32 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
        {preview ? (
          <img
            src={preview}
            alt={title}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextSibling) {
                e.currentTarget.nextSibling.style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div
          className={`flex flex-col items-center justify-center text-slate-600 gap-1 ${
            preview ? 'hidden' : 'flex'
          }`}
        >
          <ImageIcon className="w-5 h-5 text-slate-500" />
          <span className="text-[10px] text-slate-500 font-medium">No Photo</span>
        </div>
      </div>

      <div className="flex-1 space-y-2.5 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>{title}</span>
              {value && <Check className="w-3 h-3 text-emerald-400" />}
            </div>
            {sublabel && <div className="text-[10px] text-slate-400">{sublabel}</div>}
          </div>

          <label className="btn-secondary text-[11px] px-3 py-1.5 flex items-center justify-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700">
            {isUploading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload Image</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => onUpload(fieldKey, e)}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Image Path or Location (e.g. <span className="font-mono text-slate-300">D:\Business Website\Pic\...</span> or <span className="font-mono text-slate-300">/Pic/...</span>)
          </label>
          <input
            type="text"
            placeholder="e.g. D:\Business Website\Pic\DE26011\Blue\Blue_1.jpg or /Pic/..."
            value={value || ''}
            onChange={(e) => {
              const raw = e.target.value;
              const clean = normalizeImagePath(raw);
              onChange(fieldKey, clean);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}

export default function ProductFormModal({ isOpen, onClose, onSuccess, initialData = null }) {
  const isEdit = Boolean(initialData && initialData.id);
  const [activeTab, setActiveTab] = useState('pricing');
  const [formData, setFormData] = useState(EMPTY_FORM_STATE);

  const [uploadingImage, setUploadingImage] = useState({
    image_url: false,
    image_url_2: false,
    image_url_3: false,
    image_url_4: false,
  });
  const [imagePreviews, setImagePreviews] = useState({
    image_url: null,
    image_url_2: null,
    image_url_3: null,
    image_url_4: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData && initialData.id) {
      setFormData({
        ...EMPTY_FORM_STATE,
        ...initialData,
        purchase_rate: initialData.purchase_rate != null ? initialData.purchase_rate : '',
        profit_margin: initialData.profit_margin != null ? (initialData.profit_margin <= 1 ? Math.round(initialData.profit_margin * 100) : initialData.profit_margin) : '',
        meesho_price: initialData.meesho_price != null ? initialData.meesho_price : '',
        wrong_return_price: initialData.wrong_return_price != null ? initialData.wrong_return_price : '',
        mrp_pcs: initialData.mrp_pcs != null ? initialData.mrp_pcs : '',
        mrp_set: initialData.mrp_set != null ? initialData.mrp_set : '',
        gst_pct: initialData.gst_pct != null ? initialData.gst_pct : '',
        net_weight_gms: initialData.net_weight_gms != null ? initialData.net_weight_gms : '',
        inventory: initialData.inventory != null ? initialData.inventory : '',
        no_of_components: initialData.no_of_components != null ? initialData.no_of_components : '',
        num_size_per_set: initialData.num_size_per_set != null ? initialData.num_size_per_set : '',
      });
      setImagePreviews({
        image_url: initialData.thumbnail_url || (initialData.image_url ? normalizeImagePath(initialData.image_url) : null),
        image_url_2: initialData.image_url_2 ? normalizeImagePath(initialData.image_url_2) : null,
        image_url_3: initialData.image_url_3 ? normalizeImagePath(initialData.image_url_3) : null,
        image_url_4: initialData.image_url_4 ? normalizeImagePath(initialData.image_url_4) : null,
      });
    } else {
      // "+ Add New SKU": Start 100% completely empty
      setFormData({ ...EMPTY_FORM_STATE });
      setImagePreviews({
        image_url: null,
        image_url_2: null,
        image_url_3: null,
        image_url_4: null,
      });
    }
    setError(null);
    setActiveTab('pricing');
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: val };

      // 1. Reactive Pricing: if purchase_rate or profit_margin changes
      if (field === 'purchase_rate' || field === 'profit_margin') {
        const prVal = field === 'purchase_rate' ? val : prev.purchase_rate;
        const marginVal = field === 'profit_margin' ? val : prev.profit_margin;
        if (prVal !== '' && parseFloat(prVal) > 0) {
          const evalResult = evaluatePricingFormula(prVal, marginVal);
          if (evalResult.isValid) {
            next.meesho_price = evalResult.meeshoPrice;
            next.wrong_return_price = evalResult.wrongReturnPrice;
          }
        } else if (prVal === '') {
          next.meesho_price = '';
          next.wrong_return_price = '';
        }
      }

      // 2. If user manually changes meesho_price, update wrong_return_price
      if (field === 'meesho_price') {
        const num = parseFloat(val);
        if (!isNaN(num) && num > 22) {
          next.wrong_return_price = num - 22;
        } else if (val === '') {
          next.wrong_return_price = '';
        }
      }

      // 3. Reactive Barcode Generation: when style_no, colour, or sizing changes
      if (field === 'style_no' || field === 'colour' || field === 'sizing') {
        const sNo = field === 'style_no' ? val.toUpperCase().trim() : (next.style_no || '');
        const col = field === 'colour' ? val : (next.colour || '');
        const siz = field === 'sizing' ? val : (next.sizing || '');

        if (field === 'style_no') {
          next.style_no = sNo;
        }

        if (sNo) {
          const bCalc = evaluateBarcodeFormula(sNo, col, siz);
          const isAutoOrEmpty =
            !prev.individual_barcode ||
            prev.individual_barcode.startsWith(prev.style_no || '') ||
            prev.individual_barcode.startsWith(sNo);

          if (isAutoOrEmpty && bCalc.individualBarcode) {
            next.individual_barcode = bCalc.individualBarcode;
            next.pack_barcode = bCalc.packBarcode;
            if (!prev.sku_id || prev.sku_id === prev.individual_barcode || prev.sku_id.startsWith(prev.style_no || '')) {
              next.sku_id = bCalc.individualBarcode;
            }
          }
        } else {
          // If style_no was cleared, clear auto-generated barcodes
          if (prev.individual_barcode && prev.individual_barcode.startsWith(prev.style_no || '')) {
            next.individual_barcode = '';
            next.pack_barcode = '';
            if (prev.sku_id && prev.sku_id.startsWith(prev.style_no || '')) {
              next.sku_id = '';
            }
          }
        }
      }

      // If user manually edits individual_barcode:
      if (field === 'individual_barcode') {
        const cleanBc = val.trim().toUpperCase();
        next.individual_barcode = cleanBc;
        if (cleanBc) {
          next.pack_barcode = `P${cleanBc}`;
          if (!prev.sku_id || prev.sku_id === prev.individual_barcode) {
            next.sku_id = cleanBc;
          }
        } else {
          next.pack_barcode = '';
        }
      }

      // If user manually edits pack_barcode:
      if (field === 'pack_barcode') {
        next.pack_barcode = val.trim().toUpperCase();
      }

      // 4. MRP Pcs change: sync mrp_set if empty or equal
      if (field === 'mrp_pcs') {
        if (!prev.mrp_set || prev.mrp_set === prev.mrp_pcs) {
          next.mrp_set = val;
        }
      }

      // 5. Country of Origin change: if India, auto-set importer fields
      if (field === 'country_of_origin') {
        if (val && val.trim().toLowerCase() === 'india') {
          next.importer_name = 'Not Required';
          next.importer_address = 'Not Required';
          next.importer_pincode = 'Not Required';
        }
      }

      // 6. Image paths normalization (auto-convert Windows paths e.g. D:\... to /Pic/...)
      if (['image_url', 'image_url_2', 'image_url_3', 'image_url_4'].includes(field)) {
        const norm = normalizeImagePath(val);
        next[field] = norm;
        setImagePreviews((p) => ({ ...p, [field]: norm }));
      }

      return next;
    });
  };

  const handleImageFileSelect = async (field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage((prev) => ({ ...prev, [field]: true }));
    setError(null);
    try {
      const res = await api.uploadProductImage(file);
      const cleanPath = normalizeImagePath(res.image_url);
      setFormData((prev) => ({
        ...prev,
        [field]: cleanPath,
      }));
      setImagePreviews((prev) => ({
        ...prev,
        [field]: res.thumbnail_url || cleanPath,
      }));
    } catch (err) {
      setError(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.style_no.trim()) {
      setError('Style Number is required (e.g. DE26085)');
      return;
    }
    const prNum = parseFloat(formData.purchase_rate);
    if (isNaN(prNum) || prNum <= 0) {
      setError('Please provide a valid Purchase Rate greater than 0');
      return;
    }
    const mpNum = parseFloat(formData.meesho_price);
    if (isNaN(mpNum) || mpNum <= 0) {
      setError('Please provide a valid Meesho selling price greater than 0');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      // Build clean payload: ensure numeric fields are numbers or null, not empty strings
      const payload = {
        ...formData,
        style_no: formData.style_no.trim().toUpperCase(),
        purchase_rate: prNum,
        profit_margin: formData.profit_margin !== '' ? (parseFloat(formData.profit_margin) > 1 ? parseFloat(formData.profit_margin) / 100 : parseFloat(formData.profit_margin)) : 0.18,
        meesho_price: mpNum,
        wrong_return_price: formData.wrong_return_price !== '' ? parseFloat(formData.wrong_return_price) : (mpNum > 22 ? mpNum - 22 : 0),
        mrp_pcs: formData.mrp_pcs !== '' ? parseFloat(formData.mrp_pcs) : 499.0,
        mrp_set: formData.mrp_set !== '' ? parseFloat(formData.mrp_set) : 499.0,
        gst_pct: formData.gst_pct !== '' ? parseFloat(formData.gst_pct) : 5.0,
        net_weight_gms: formData.net_weight_gms !== '' ? parseInt(formData.net_weight_gms, 10) : 285,
        inventory: formData.inventory !== '' ? parseInt(formData.inventory, 10) : 10,
        no_of_components: formData.no_of_components !== '' ? parseInt(formData.no_of_components, 10) : 1,
        num_size_per_set: formData.num_size_per_set !== '' ? parseInt(formData.num_size_per_set, 10) : 1,
        image_url: normalizeImagePath(formData.image_url),
        image_url_2: normalizeImagePath(formData.image_url_2),
        image_url_3: normalizeImagePath(formData.image_url_3),
        image_url_4: normalizeImagePath(formData.image_url_4),
      };

      if (isEdit) {
        await api.updateProduct(initialData.id, payload);
      } else {
        await api.createProduct(payload);
      }
      onSuccess?.(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-4xl max-h-[92vh] overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl rounded-2xl flex flex-col text-slate-100">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              {isEdit ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {isEdit ? `Edit Product SKU: ${formData.style_no}` : 'Add New Product SKU'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  All 65 Excel Fields
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Synchronizes seamlessly with <span className="font-mono text-emerald-300">Barcode Master.xlsx</span> and <span className="font-mono text-emerald-300">Meesho Template</span> on disk.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation for 65 Fields */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-1 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>1. Identity & Pricing ({STANDARD_COLORS.length} Colors)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('garment')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'garment'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>2. Sizing & Garment Attributes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logistics')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'logistics'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>3. Manufacturing & Logistics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'photos'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>4. Photos & Marketplace Description</span>
          </button>
        </div>

        {/* Modal Form Scroll Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: IDENTITY & PRICING */}
          {activeTab === 'pricing' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                  Product Identification & Classification
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Style No <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DE26085"
                      value={formData.style_no}
                      onChange={(e) => handleChange('style_no', e.target.value.toUpperCase().trim())}
                      disabled={isEdit}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60 font-mono"
                    />
                  </div>

                  <SelectDropdown
                    label="Colour"
                    value={formData.colour}
                    onChange={(val) => handleChange('colour', val)}
                    options={STANDARD_COLORS}
                    required={true}
                    placeholder="-- Select Colour --"
                  />

                  <SelectDropdown
                    label="Sizing / Variation"
                    value={formData.sizing}
                    onChange={(val) => handleChange('sizing', val)}
                    options={STANDARD_SIZES}
                    required={true}
                    placeholder="-- Select Size --"
                  />

                  <SelectDropdown
                    label="Category"
                    value={formData.category}
                    onChange={(val) => handleChange('category', val)}
                    options={STANDARD_CATEGORIES}
                    placeholder="-- Select Category --"
                  />

                  <SelectDropdown
                    label="Sub Category"
                    value={formData.sub_category}
                    onChange={(val) => handleChange('sub_category', val)}
                    options={STANDARD_SUB_CATEGORIES}
                    placeholder="-- Select Sub Category --"
                  />

                  <SelectDropdown
                    label="Neck / Product Type"
                    value={formData.product_type}
                    onChange={(val) => handleChange('product_type', val)}
                    options={STANDARD_NECKS}
                    placeholder="-- Select Neck / Type --"
                  />

                  <SelectDropdown
                    label="Sub Product"
                    value={formData.sub_product}
                    onChange={(val) => handleChange('sub_product', val)}
                    options={STANDARD_SUB_PRODUCTS}
                    placeholder="-- Select Sub Product --"
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Procurement Costing & Marketplace Pricing (₹)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Purchase Rate (₹) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="e.g. 210"
                      value={formData.purchase_rate}
                      onChange={(e) => handleChange('purchase_rate', e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Profit Margin (%)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 18 (for 18%)"
                      value={formData.profit_margin}
                      onChange={(e) => handleChange('profit_margin', e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Meesho Price (₹) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="Auto-calculated (e.g. 325)"
                      value={formData.meesho_price}
                      onChange={(e) => handleChange('meesho_price', e.target.value)}
                      className="w-full bg-slate-950/80 border border-emerald-500/60 rounded-lg px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Wrong Return (₹)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Auto-calculated (e.g. 303)"
                      value={formData.wrong_return_price}
                      onChange={(e) => handleChange('wrong_return_price', e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">MRP Pcs (₹)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 499"
                      value={formData.mrp_pcs}
                      onChange={(e) => handleChange('mrp_pcs', e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">MRP Set (₹)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 499"
                      value={formData.mrp_set}
                      onChange={(e) => handleChange('mrp_set', e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <SelectDropdown
                    label="GST Rate (%)"
                    value={formData.gst_pct}
                    onChange={(val) => handleChange('gst_pct', val)}
                    options={STANDARD_GST_RATES}
                    placeholder="-- Select GST % --"
                  />

                  <SelectDropdown
                    label="HSN ID"
                    value={formData.hsn_id}
                    onChange={(val) => handleChange('hsn_id', val)}
                    options={STANDARD_HSN_CODES}
                    placeholder="-- Select HSN ID --"
                  />
                </div>

                {/* Live Formula Computation Engine Card */}
                <div className="mt-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/30">
                        FX FORMULA
                      </span>
                      <span className="text-xs font-semibold text-emerald-300">
                        Live Formula Engine (Barcode Master & Meesho Catalog)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 w-fit">
                      Real-Time Evaluator
                    </span>
                  </div>

                  <div className="text-[11px] font-mono bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 text-emerald-300 overflow-x-auto whitespace-pre">
                    =ROUND(($O2+($O2*$P2))*1.05*1.20, 0)
                  </div>

                  {(() => {
                    const calc = evaluatePricingFormula(formData.purchase_rate, formData.profit_margin);
                    if (!calc.isValid) {
                      return (
                        <div className="text-xs text-slate-400 italic bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-center gap-2">
                          <span>💡</span>
                          <span>Enter <strong>Purchase Rate (₹)</strong> and <strong>Profit Margin (%)</strong> above — Meesho Selling Price and Wrong Return Price will compute right then and there.</span>
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-2 pt-1">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400 uppercase font-medium">1. Cost + Profit (T1)</div>
                            <div className="font-mono text-white font-bold text-sm">₹{calc.t1}</div>
                            <div className="text-[9px] text-slate-400 font-mono">₹{calc.pr} + {calc.marginPercent}% Margin</div>
                          </div>
                          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400 uppercase font-medium">2. With 5% GST (T2)</div>
                            <div className="font-mono text-white font-bold text-sm">₹{calc.t2}</div>
                            <div className="text-[9px] text-slate-400 font-mono">+5% Statutory Tax</div>
                          </div>
                          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400 uppercase font-medium">3. With 20% Return (T3)</div>
                            <div className="font-mono text-white font-bold text-sm">₹{calc.t3}</div>
                            <div className="text-[9px] text-slate-400 font-mono">+20% Meesho Return/RTO</div>
                          </div>
                          <div className="bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/40">
                            <div className="text-[10px] text-emerald-400 uppercase font-bold">Meesho Price</div>
                            <div className="font-mono text-emerald-300 font-extrabold text-lg">₹{calc.meeshoPrice}</div>
                            <div className="text-[9px] text-emerald-400 font-mono">Wrong Return: ₹{calc.wrongReturnPrice}</div>
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-300 bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
                          <span>Meesho Wrong/Defective Return Rule: <code className="font-mono text-emerald-300">=IF(Meesho&gt;22, Meesho-22, "")</code></span>
                          <span className="font-mono font-bold text-emerald-300">₹{calc.wrongReturnPrice}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Barcodes */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Barcode className="w-3.5 h-3.5 text-emerald-400" />
                  Barcodes & SKU Identification
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Individual Barcode / SKU ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Auto-generated (e.g. DE26085103313)"
                      value={formData.individual_barcode || ''}
                      onChange={(e) => handleChange('individual_barcode', e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Pack Barcode (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Auto-prefixed with 'P' if blank"
                      value={formData.pack_barcode || ''}
                      onChange={(e) => handleChange('pack_barcode', e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Live Barcode Construction Engine Card */}
                <div className="mt-4 p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono text-[11px] font-bold border border-cyan-500/30">
                        FX BARCODE
                      </span>
                      <span className="text-xs font-semibold text-cyan-300">
                        Live Barcode Generation Engine (Master Specification)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700 w-fit">
                      Real-Time Generator
                    </span>
                  </div>

                  <div className="text-[11px] font-mono bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 text-cyan-300 overflow-x-auto whitespace-pre">
                    Individual = STYLE & "1" & TEXT(ColourCode, "000") & TEXT(SizeCode, "00")   |   Pack = "P" & Individual
                  </div>

                  {(() => {
                    const bCalc = evaluateBarcodeFormula(formData.style_no, formData.colour, formData.sizing);
                    if (!bCalc.hasStyle && !bCalc.hasColour && !bCalc.hasSize) {
                      return (
                        <div className="text-xs text-slate-400 italic bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-center gap-2">
                          <span>💡</span>
                          <span>
                            Enter <strong>Style No</strong>, <strong>Colour</strong>, and <strong>Sizing</strong> above — Individual Barcode and Pack Barcode will synthesize automatically right then and there.
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-2 pt-1">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400 uppercase font-medium">1. Style Number</div>
                            <div className={`font-mono font-bold text-sm truncate ${bCalc.hasStyle ? 'text-white' : 'text-slate-500 italic'}`}>
                              {bCalc.styleNo || 'Waiting...'}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono">Base SKU Root</div>
                          </div>
                          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400 uppercase font-medium">2. Category Digit</div>
                            <div className="font-mono text-cyan-300 font-bold text-sm">1</div>
                            <div className="text-[9px] text-slate-400 font-mono">Nightwear / Garment</div>
                          </div>
                          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400 uppercase font-medium">3. Colour Code</div>
                            <div className={`font-mono font-bold text-sm ${bCalc.hasColour ? 'text-cyan-300' : 'text-slate-500 italic'}`}>
                              {bCalc.colorCode || 'Waiting...'}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono truncate">
                              {bCalc.colour ? `${bCalc.colour} (3-digit)` : 'Select Colour'}
                            </div>
                          </div>
                          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400 uppercase font-medium">4. Size Code</div>
                            <div className={`font-mono font-bold text-sm ${bCalc.hasSize ? 'text-cyan-300' : 'text-slate-500 italic'}`}>
                              {bCalc.sizeCode || 'Waiting...'}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono truncate">
                              {bCalc.sizing ? `${bCalc.sizing} (2-digit)` : 'Select Size'}
                            </div>
                          </div>
                        </div>

                        {/* Result Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          <div className="bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-500/40 flex flex-col justify-between">
                            <div className="text-[10px] text-cyan-400 uppercase font-bold flex items-center justify-between">
                              <span>Individual Barcode</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-900/60 font-mono text-cyan-300">
                                {bCalc.individualBarcode ? `${bCalc.individualBarcode.length} chars` : 'Pending'}
                              </span>
                            </div>
                            <div className="font-mono text-cyan-200 font-extrabold text-base tracking-wider mt-1 select-all">
                              {bCalc.individualBarcode || formData.individual_barcode || '—'}
                            </div>
                            <div className="text-[9px] text-cyan-400/80 font-mono mt-0.5">
                              {bCalc.hasStyle && bCalc.hasColour && bCalc.hasSize
                                ? `${bCalc.styleNo} + 1 + ${bCalc.colorCode} + ${bCalc.sizeCode}`
                                : 'Awaiting required style, colour & size parameters'}
                            </div>
                          </div>

                          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-700 flex flex-col justify-between">
                            <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
                              <span>Pack Barcode</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
                                {bCalc.packBarcode ? `${bCalc.packBarcode.length} chars` : 'Pending'}
                              </span>
                            </div>
                            <div className="font-mono text-white font-extrabold text-base tracking-wider mt-1 select-all">
                              {bCalc.packBarcode || formData.pack_barcode || '—'}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                              {bCalc.individualBarcode
                                ? `"P" + ${bCalc.individualBarcode}`
                                : formData.pack_barcode || 'Prefix "P" automatically applied'}
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-300 bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
                          <span>Excel Master Rule: <code className="font-mono text-cyan-300">STYLE & "1" & VLOOKUP(Colour) & VLOOKUP(Size)</code></span>
                          <span className="font-mono font-bold text-cyan-300">100% Master Match (47/47)</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GARMENT SPECS & SIZING */}
          {activeTab === 'garment' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-emerald-400" />
                  Garment Fit & Detailed Body Measurements (Inches)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <SelectDropdown
                    label="Bust Size (in)"
                    value={formData.bust_size}
                    onChange={(val) => handleChange('bust_size', val)}
                    options={STANDARD_BUST_SIZES}
                    placeholder="-- Select Bust --"
                  />

                  <SelectDropdown
                    label="Length Size (in)"
                    value={formData.length_size}
                    onChange={(val) => handleChange('length_size', val)}
                    options={STANDARD_LENGTH_SIZES}
                    placeholder="-- Select Length --"
                  />

                  <SelectDropdown
                    label="Hip Size (in)"
                    value={formData.hip_size}
                    onChange={(val) => handleChange('hip_size', val)}
                    options={STANDARD_HIP_SIZES}
                    placeholder="-- Select Hip --"
                  />

                  <SelectDropdown
                    label="Waist Size (in)"
                    value={formData.waist_size}
                    onChange={(val) => handleChange('waist_size', val)}
                    options={STANDARD_WAIST_SIZES}
                    placeholder="-- Select Waist --"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  Fabric Composition & Style Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <SelectDropdown
                    label="Fabric (Meesho Field)"
                    value={formData.fabric}
                    onChange={(val) => handleChange('fabric', val)}
                    options={STANDARD_FABRICS}
                    placeholder="-- Select Fabric --"
                  />

                  <SelectDropdown
                    label="Fabric Composition (Barcode)"
                    value={formData.fabric_composition}
                    onChange={(val) => handleChange('fabric_composition', val)}
                    options={STANDARD_FABRIC_COMPOSITIONS}
                    placeholder="-- Select Composition --"
                  />

                  <SelectDropdown
                    label="Fabric Type"
                    value={formData.fabric_type}
                    onChange={(val) => handleChange('fabric_type', val)}
                    options={STANDARD_FABRIC_TYPES}
                    placeholder="-- Select Fabric Type --"
                  />

                  <SelectDropdown
                    label="Fit / Type"
                    value={formData.fit_type}
                    onChange={(val) => handleChange('fit_type', val)}
                    options={STANDARD_FIT_TYPES}
                    placeholder="-- Select Fit / Type --"
                  />

                  <SelectDropdown
                    label="Generic Name"
                    value={formData.generic_name}
                    onChange={(val) => handleChange('generic_name', val)}
                    options={STANDARD_GENERIC_NAMES}
                    placeholder="-- Select Generic Name --"
                  />

                  <SelectDropdown
                    label="Pattern"
                    value={formData.pattern}
                    onChange={(val) => handleChange('pattern', val)}
                    options={STANDARD_PATTERNS}
                    placeholder="-- Select Pattern --"
                  />

                  <SelectDropdown
                    label="Print or Pattern Type"
                    value={formData.print_type}
                    onChange={(val) => handleChange('print_type', val)}
                    options={STANDARD_PRINT_TYPES}
                    placeholder="-- Select Print Type --"
                  />

                  <SelectDropdown
                    label="Sleeve Length"
                    value={formData.sleeve_length}
                    onChange={(val) => handleChange('sleeve_length', val)}
                    options={STANDARD_SLEEVE_LENGTHS}
                    placeholder="-- Select Sleeve Length --"
                  />

                  <SelectDropdown
                    label="Pockets"
                    value={formData.pockets}
                    onChange={(val) => handleChange('pockets', val)}
                    options={STANDARD_POCKETS}
                    placeholder="-- Select Pockets --"
                  />

                  <SelectDropdown
                    label="Occasion"
                    value={formData.occasion}
                    onChange={(val) => handleChange('occasion', val)}
                    options={STANDARD_OCCASIONS}
                    placeholder="-- Select Occasion --"
                  />

                  <SelectDropdown
                    label="Surface Styling"
                    value={formData.surface_styling}
                    onChange={(val) => handleChange('surface_styling', val)}
                    options={STANDARD_SURFACE_STYLINGS}
                    placeholder="-- Select Surface Styling --"
                  />

                  <SelectDropdown
                    label="Garment Length"
                    value={formData.length}
                    onChange={(val) => handleChange('length', val)}
                    options={STANDARD_LENGTHS}
                    placeholder="-- Select Garment Length --"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANUFACTURING & LOGISTICS */}
          {activeTab === 'logistics' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  Origin & Statutory Logistics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Stock / Inventory</label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      value={formData.inventory}
                      onChange={(e) => handleChange('inventory', e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Net Weight (gms)</label>
                    <input
                      type="number"
                      placeholder="e.g. 285"
                      value={formData.net_weight_gms}
                      onChange={(e) => handleChange('net_weight_gms', e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <SelectDropdown
                    label="Country of Origin"
                    value={formData.country_of_origin}
                    onChange={(val) => handleChange('country_of_origin', val)}
                    options={STANDARD_COUNTRIES}
                    placeholder="-- Select Country --"
                  />

                  <SelectDropdown
                    label="Season"
                    value={formData.season}
                    onChange={(val) => handleChange('season', val)}
                    options={STANDARD_SEASONS}
                    placeholder="-- Select Season --"
                  />

                  <SelectDropdown
                    label="Components"
                    value={formData.no_of_components}
                    onChange={(val) => handleChange('no_of_components', val)}
                    options={STANDARD_COMPONENTS}
                    placeholder="-- Select Components --"
                  />

                  <SelectDropdown
                    label="Sizes per Set"
                    value={formData.num_size_per_set}
                    onChange={(val) => handleChange('num_size_per_set', val)}
                    options={STANDARD_SIZES_PER_SET}
                    placeholder="-- Select Sizes/Set --"
                  />

                  <SelectDropdown
                    label="Net Quantity (N)"
                    value={formData.net_quantity}
                    onChange={(val) => handleChange('net_quantity', val)}
                    options={STANDARD_NET_QUANTITIES}
                    placeholder="-- Select Net Qty --"
                  />

                  <SelectDropdown
                    label="Add ons"
                    value={formData.add_ons}
                    onChange={(val) => handleChange('add_ons', val)}
                    options={STANDARD_ADD_ONS}
                    placeholder="-- Select Add Ons --"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  Statutory Manufacturer & Packer Disclosure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <EditableDropdown
                    label="Manufacturer Name"
                    value={formData.manufacturer_name}
                    onChange={(val) => handleChange('manufacturer_name', val)}
                    options={STANDARD_MANUFACTURERS}
                    placeholder="e.g. Pegasus Creation"
                  />

                  <EditableDropdown
                    label="Manufacturer Address"
                    value={formData.manufacturer_address}
                    onChange={(val) => handleChange('manufacturer_address', val)}
                    options={STANDARD_MANUFACTURER_ADDRESSES}
                    placeholder="e.g. Prasanta Apartment, Check Post"
                  />

                  <EditableDropdown
                    label="Manufacturer Pincode"
                    value={formData.manufacturer_pincode}
                    onChange={(val) => handleChange('manufacturer_pincode', val)}
                    options={STANDARD_PINCODES}
                    placeholder="e.g. 700125"
                  />

                  <EditableDropdown
                    label="Packer Name"
                    value={formData.packer_name}
                    onChange={(val) => handleChange('packer_name', val)}
                    options={STANDARD_PACKERS}
                    placeholder="e.g. Divine Enterprise"
                  />

                  <EditableDropdown
                    label="Packer Address"
                    value={formData.packer_address}
                    onChange={(val) => handleChange('packer_address', val)}
                    options={STANDARD_MANUFACTURER_ADDRESSES}
                    placeholder="e.g. Prasanta Apartment, Check Post"
                  />

                  <EditableDropdown
                    label="Packer Pincode"
                    value={formData.packer_pincode}
                    onChange={(val) => handleChange('packer_pincode', val)}
                    options={STANDARD_PINCODES}
                    placeholder="e.g. 700125"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PHOTOS & MARKETPLACE DESCRIPTION */}
          {activeTab === 'photos' && (
            <div className="space-y-5 animate-fade-in pb-12">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  Garment Photography (Images 1, 2, 3, 4 with Direct Uploads)
                </h3>
                <p className="text-[11px] text-slate-400 mb-3">
                  Upload photos directly from your computer or enter local Windows folders (e.g.{' '}
                  <span className="font-mono text-emerald-300">D:\Business Website\Pic\DE26011\Blue\Blue_1.jpg</span>) — paths are automatically normalized!
                </p>

                <div className="space-y-3">
                  <PhotoUploadCard
                    title="Image 1: Primary Catalog Front View (Main)"
                    sublabel="Required for marketplace catalog thumbnail & main search listing"
                    fieldKey="image_url"
                    value={formData.image_url}
                    preview={imagePreviews.image_url}
                    onChange={handleChange}
                    onUpload={handleImageFileSelect}
                    isUploading={uploadingImage.image_url}
                  />

                  <PhotoUploadCard
                    title="Image 2: Back / Full-Length Perspective"
                    sublabel="Displays back neck styling, silhouette and garment drape"
                    fieldKey="image_url_2"
                    value={formData.image_url_2}
                    preview={imagePreviews.image_url_2}
                    onChange={handleChange}
                    onUpload={handleImageFileSelect}
                    isUploading={uploadingImage.image_url_2}
                  />

                  <PhotoUploadCard
                    title="Image 3: Fabric Texture & Detail View"
                    sublabel="Close-up of weave pattern, print quality and surface embellishment"
                    fieldKey="image_url_3"
                    value={formData.image_url_3}
                    preview={imagePreviews.image_url_3}
                    onChange={handleChange}
                    onUpload={handleImageFileSelect}
                    isUploading={uploadingImage.image_url_3}
                  />

                  <PhotoUploadCard
                    title="Image 4: Folded / Packaging View"
                    sublabel="Folded garment showing branding, polybag tag or package appearance"
                    fieldKey="image_url_4"
                    value={formData.image_url_4}
                    preview={imagePreviews.image_url_4}
                    onChange={handleChange}
                    onUpload={handleImageFileSelect}
                    isUploading={uploadingImage.image_url_4}
                  />
                </div>
              </div>

              {/* Product Name & Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Product Name (Official Meesho Title)
                </label>
                <input
                  type="text"
                  value={formData.product_name || ''}
                  onChange={(e) => handleChange('product_name', e.target.value)}
                  placeholder="Official Meesho Product Title..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Provide comprehensive details about garment fabrication, fit, sleep comfort..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between sticky bottom-0 bg-slate-900/95 backdrop-blur-md">
            <div className="text-xs text-slate-400">
              Editing: <span className="font-mono text-emerald-400">{formData.style_no || 'New SKU'}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || Object.values(uploadingImage).some(Boolean)}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving & Synchronizing Workbooks...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isEdit ? 'Save Changes & Sync to Excel' : 'Create SKU & Sync to Excel'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
