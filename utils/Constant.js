export const LOGIN_METHOD_LIST = [
  {
    id: 1,
    title: "ABHA",
    alText: "Verify using ABHA Number",
    imagesrc: "./abha_ic.svg",
  },
  {
    id: 2,
    title: "Mobile Number",
    alText: "Verify using Mobile Number",
    imagesrc: "./phone_no_ic.svg",
  },
];

export const NOTIFICATION_METHOD_LIST = [
  { id: "aadhaarotp", title: "Aadhaar OTP" },
  { id: "mobileotp", title: "Mobile OTP" },
];

export const ABHA_METHODS = [
  { id: "abhaaddress", title: "ABHA Address" },
  { id: "abhanumber", title: "ABHA Number" },
];

export const FIRST_NAME_PREFIX_LIST = [
  "Baby",
  "Dr.",
  "Dr.(Mrs.)",
  "Dr.(Ms.)",
  "Master",
  "Mr.",
  "Mrs.",
  "Ms.",
  "Mx.",
  "Shri.",
  "Shrimati.",
  "Sr.",
];

export const DATE_PICKER_OPTION = {
  autoHide: true,
  todayBtn: true,
  clearBtn: true,
  inputDateFormatProp: {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  },
  theme: {
    background: "",
    todayBtn: "",
    clearBtn: "",
    icons: "",
    text: "",
    disabledText: "",
    input: "",
    inputIcon: "",
    selected: "",
  },
};

export const GENDER_LIST = [
  { id: "M", title: "Male" },
  { id: "F", title: "Female" },
  { id: "O", title: "Other" },
];

export const PATIENT_FORM_SCHEMA = [
  {
    name: "campaigncode",
    label: "Campaign Code",
    validation: [
      {
        type: "maxLength",
        message: "Campaign Code should not exceed 50 characters",
        value: 50,
      },
      {
        type: "characters",
        message: "Campaign Code should have only characters",
        regex: /^[a-zA-Z ]*$/,
      },
    ],
  },
  {
    name: "title",
    label: "Title",
    isRequired: true,
  },
  {
    name: "firstName",
    label: "First name",
    isRequired: true,
    placeholder: "First Name",
    validation: [
      {
        type: "maxLength",
        message: "First name should not exceed 50 characters",
        value: 100,
      },
      {
        type: "characters",
        message: "First name should have only characters",
        regex: /^[a-zA-Z ]*$/,
      },
    ],
  },
  {
    name: "middleName",
    label: "Middle name",
    isRequired: false,
    validation: [
      {
        type: "maxLength",
        message: "Middle name should not exceed 50 characters",
        value: 100,
      },
      {
        type: "characters",
        message: "Middle name should have only characters",
        regex: /^[a-zA-Z ]*$/,
      },
    ],
  },
  {
    name: "lastName",
    isRequired: true,
    label: "Last Name",
    validation: [
      {
        type: "maxLength",
        message: "Last Name should not exceed 50 characters",
        value: 100,
      },
      {
        type: "characters",
        message: "Last Name should have only characters",
        regex: /^[a-zA-Z ]*$/,
      },
    ],
  },
  {
    name: "dayOfBirth",
    isRequired: true,
    label: "DD",
  },
  {
    name: "monthOfBirth",
    isRequired: true,
    label: "MM",
  },
  {
    name: "yearOfBirth",
    isRequired: true,
    label: "YYYY",
  },
  {
    isRequired: true,
    type: "radio",
    name: "gender",
    label: "Gender",
  },
  {
    isRequired: true,
    name: "mobile",
    label: "Mobile Number",
    validation: [
      {
        type: "minLength",
        message: "Mobile Number should not be less than 10 digits",
        value: 10,
      },
      {
        type: "numeric",
        message: "Mobile Number should have only numbers",
        regex: /^[0-9 ]*$/,
      },
    ],
  },
  {
    name: "whatsappmobile",
    isRequired: true,
    label: "Whats App Number",
    validation: [
      {
        type: "minLength",
        message: "Whats app Number should not be less than 10 digits",
        value: 10,
      },
      {
        type: "numeric",
        message: "Whats app Number should have only numbers",
        regex: /^[0-9 ]*$/,
      },
    ],
  },
  {
    name: "emailAddress",
    label: "Email address",
    validation: [
      {
        type: "maxLength",
        message: "Email address should not exceed 50 characters",
        value: 100,
      },
      {
        type: "email",
        message: "Email address should be valid",
        regex:
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      },
    ],
  },
  {
    name: "bldgname",
    label: "Bldg Name",
    isRequired: true,
    validation: [
      {
        type: "maxLength",
        message: "Bldg Name should not exceed 50 characters",
        value: 100,
      },
    ],
  },
  {
    type: "text",
    name: "streetaddress",
    isRequired: true,
    label: "Street address",
    validation: [
      {
        type: "maxLength",
        message: "Street address should not exceed 200 characters",
        value: 200,
      },
    ],
  },
  {
    type: "select",
    name: "area",
    mappingProp: "area",
    isRequired: true,
    label: "Area",
  },
  {
    type: "select",
    name: "city",
    label: "City",
  },
  {
    type: "select",
    name: "district",
    label: "District",
  },

  {
    type: "select",
    name: "state",
    label: "State",
  },
  {
    type: "select",
    name: "country",
    mappingProp: "country",
    // isRequired: true,
    label: "Country",
    placeholder: "Select Country",
    options: [],
  },
  {
    type: "select",
    name: "nationality",
    mappingProp: "country",
    // isRequired: true,
    label: "Nationality",
    placeholder: "Select Nationality",
    options: [],
  },
  {
    name: "pincode",
    isRequired: true,
    label: "Pin Code",
    validation: [
      {
        type: "minLength",
        message: "Pin Code should not be less than 6 digits",
        value: 6,
      },
      {
        type: "numeric",
        message: "Pin Code should have only characters",
        regex: /^[0-9 ]*$/,
      },
    ],
  },
  {
    name: "nextofkin",
    isRequired: true,
    label: "Next of Kin",
    validation: [
      {
        type: "maxLength",
        message: "Next of Kin should not exceed 50 characters",
        value: 50,
      },
      {
        type: "characters",
        message: "Next of Kin should have only characters",
        regex: /^[a-zA-Z ]*$/,
      },
    ],
  },
  {
    name: "nextofkinrelation",
    isRequired: true,
    label: "Next of Kin Relation",
    validation: [
      {
        type: "maxLength",
        message: "Next of Kin Relation should not exceed 50 characters",
        value: 50,
      },
      {
        type: "characters",
        message: "Next of Kin Relation should have only characters",
        regex: /^[a-zA-Z ]*$/,
      },
    ],
  },
  {
    name: "agreed",
    isRequired: true,
    label: "Accept Terms and Conditions",
  },
  {
    name: "nickName",
    label: "Nick Name",
    validation: [
      {
        type: "maxLength",
        message: "Nick Name should not exceed 100 characters",
        value: 100,
      },
      {
        type: "alphaNumeric",
        message: "Nick Name should have only characters and numbers",
        regex: /^[a-zA-Z0-9 ]*$/,
      },
    ],
  },
];

export const BANKDETAILS_FORM_SCHEMA = [
  {
    name: "refundInCashECS",
    isRequired: true,
  },
  {
    name: "bankDetailsAvailableYN",
    isRequired: true,
  },
  {
    name: "bankDetailsSelfKinOther",
    isRequired: true,
  },
];

export const ACCOUNTDETAILS_FORM_SCHEMA = [
  {
    name: "bankName",
    isRequired: true,
  },
  {
    name: "branchName",
    isRequired: true,
  },
  {
    name: "accountHolderName",
    isRequired: true,
    validation: [
      {
        type: "alphaNumeric",
        message: "Account holder name should have only characters and numbers",
        regex: /^[a-zA-Z0-9 ]*$/,
      },
    ],
  },
  {
    name: "ifscCode",
    isRequired: true,
    validation: [
      {
        type: "alphaNumeric",
        message: "Enter valid IFSC Code",
        regex: /^[A-Za-z0-9]{4}0[A-Za-z0-9]{6}$/,
      },
    ],
  },
  {
    name: "bankAccountNo",
    isRequired: true,
    validation: [
      {
        type: "alphaNumeric",
        message: "Bank Account No should have only characters and numbers",
        regex: /^[a-zA-Z0-9 ]*$/,
      },
    ],
  },
];
export const OTHERBANKDETAILS_FORM_SCHEMA = [
  {
    name: "nameOfRelative",
    isRequired: true,
    validation: [
      {
        type: "alphaNumeric",
        message: "Relative Name should have only characters",
        regex: /^[a-zA-Z ]*$/,
      },
    ],
  },
  {
    name: "relativeMobileNo",
    isRequired: true,
    validation: [
      {
        type: "minLength",
        message: "Mobile Number should be 10 digits",
        value: 10,
      },
      {
        type: "maxLength",
        message: "Mobile Number should be 10 digits",
        value: 10,
      },
      {
        type: "numeric",
        message: "Mobile Number should have only numbers",
        regex: /^[0-9 ]*$/,
      },
    ],
  },
  {
    name: "relativeEmail",
    isRequired: true,
    validation: [
      {
        type: "maxLength",
        message: "Email address should not exceed 50 characters",
        value: 100,
      },
      {
        type: "email",
        message: "Email address should be valid",
        regex:
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      },
    ],
  },
  {
    name: "relationWithPatient",
    isRequired: true,
    validation: [
      {
        type: "alphaNumeric",
        message: "Relation should have only characters and numbers",
        regex: /^[a-zA-Z ]*$/,
      },
    ],
  },
];

export const DOCTORS_SPECIALITY = {
  status: true,
  success: [
    {
      code: "001",
      name: "Dietician                               ",
    },
    {
      code: "002",
      name: "Sleep Medicine",
    },
    {
      code: "003",
      name: "Health Psychology",
    },
    {
      code: "004",
      name: "General Physician                       ",
    },
    {
      code: "005",
      name: "Diabetalogist                           ",
    },
    {
      code: "006",
      name: "Dermatology",
    },
    {
      code: "007",
      name: "E.N.T.",
    },
    {
      code: "008",
      name: "Paediatrician",
    },
    {
      code: "009",
      name: "Gen/Lap Surgery",
    },
    {
      code: "010",
      name: "Gynaecology                             ",
    },
    {
      code: "011",
      name: "Bariatric Physician",
    },
    {
      code: "012",
      name: "Psychotherapy",
    },
    {
      code: "013",
      name: "Chest Physician",
    },
    {
      code: "014",
      name: "Rheumatology",
    },
    {
      code: "015",
      name: "Endocrinology",
    },
    {
      code: "016",
      name: "Psychiatry                              ",
    },
    {
      code: "017",
      name: "Paediatric Enocrinology",
    },
    {
      code: "018",
      name: "Paediatric Nephrology",
    },
    {
      code: "019",
      name: "Neuro Surgeon                           ",
    },
    {
      code: "020",
      name: "Neurology",
    },
    {
      code: "021",
      name: "Plastic Surgeon                         ",
    },
    {
      code: "022",
      name: "Paediatric Neurology",
    },
    {
      code: "023",
      name: "Nephrology                              ",
    },
    {
      code: "024",
      name: "CVTS",
    },
    {
      code: "025",
      name: "Cardiologist                            ",
    },
    {
      code: "026",
      name: "Medical Oncology                        ",
    },
    {
      code: "027",
      name: "Surgical Oncology",
    },
    {
      code: "028",
      name: "Radiation Oncology",
    },
    {
      code: "029",
      name: "Orthopaedic                             ",
    },
    {
      code: "030",
      name: "Paediatric Orhtopaedic",
    },
    {
      code: "031",
      name: "Pain Management",
    },
    {
      code: "032",
      name: "Gastroeneterology",
    },
    {
      code: "033",
      name: "Urology                                 ",
    },
    {
      code: "034",
      name: "Paediatric Haemoatologist",
    },
    {
      code: "035",
      name: "Haematology",
    },
    {
      code: "036",
      name: "Paediatric Rheumatology",
    },
    {
      code: "037",
      name: "Cardiology - EP Study",
    },
    {
      code: "038",
      name: "Chest Medicine",
    },
    {
      code: "039",
      name: "Dentist",
    },
    {
      code: "040",
      name: "Foot & Ankle Surgeon",
    },
    {
      code: "041",
      name: "Gen, Cancer And Gastrointestinal Endo   ",
    },
    {
      code: "042",
      name: "Gen. Surg,Bariatric And Metabolic Surg  ",
    },
    {
      code: "043",
      name: "General Medicine                        ",
    },
    {
      code: "044",
      name: "GI Surgeon",
    },
    {
      code: "045",
      name: "Infectious Disease                      ",
    },
    {
      code: "046",
      name: "Neuro Physician",
    },
    {
      code: "047",
      name: "Onco. Physician",
    },
    {
      code: "048",
      name: "Onco. Surgeon",
    },
    {
      code: "049",
      name: "Paed. Surgeon                           ",
    },
    {
      code: "050",
      name: "Shoulder And Sports Injuries Surgeon    ",
    },
    {
      code: "051",
      name: "Spine Surgeon                           ",
    },
    {
      code: "052",
      name: "Intensivist",
    },
    {
      code: "053",
      name: "Anaesthetist",
    },
    {
      code: "054",
      name: "Anaesthetist - Cardiology",
    },
    {
      code: "055",
      name: "Interventional Radiologist\r\n",
    },
    {
      code: "056",
      name: "Hepatobilliary and liver transplant     ",
    },
    {
      code: "057",
      name: "Breast Surgery                          ",
    },
    {
      code: "058",
      name: "Opthalmologist                          ",
    },
    {
      code: "059",
      name: "Cardiac Camp                            ",
    },
    {
      code: "060",
      name: "Vascular Surgery                        ",
    },
    {
      code: "061",
      name: "Nutrition                               ",
    },
    {
      code: "062",
      name: "Physiotherapy                           ",
    },
    {
      code: "063",
      name: "Paediatric Speech Pathology             ",
    },
    {
      code: "064",
      name: "Palliative Medicine                     ",
    },
    {
      code: "065",
      name: "Nuclear  Medicine                       ",
    },
    {
      code: "066",
      name: "Family and Child Counsellor             ",
    },
    {
      code: "067",
      name: "Hand and Foot Surgery                   ",
    },
    {
      code: "068",
      name: "Paediatric Cardiology                   ",
    },
    {
      code: "069",
      name: "Paediatric Cardiac Surgery              ",
    },
    {
      code: "070",
      name: "IVF and INFERTILITY                     ",
    },
    {
      code: "071",
      name: "Jupiter Dialysis Clinic                 ",
    },
    {
      code: "072",
      name: "Digital Consultation                    ",
    },
    {
      code: "073",
      name: "Paed. Gastroenterology And Hepatology   ",
    },
    {
      code: "074",
      name: "Hepatobiliary                           ",
    },
    {
      code: "075",
      name: "Occupational Therapist                  ",
    },
    {
      code: "076",
      name: "Vascular Surgeon                        ",
    },
    {
      code: "077",
      name: "Psychologist                            ",
    },
    {
      code: "078",
      name: "Speech Therapy                          ",
    },
    {
      code: "079",
      name: "Interventional Cardiologist             ",
    },
    {
      code: "080",
      name: "Developmental & Behavioural Paediatric  ",
    },
    {
      code: "081",
      name: "Sports Nutritionist                     ",
    },
    {
      code: "082",
      name: "Gynaecology PS Clinic                   ",
    },
    {
      code: "083",
      name: "Jupiter Clinic Pimple Saudagar          ",
    },
    {
      code: "084",
      name: "Endodontics                             ",
    },
    {
      code: "085",
      name: "Clinical Psychology                     ",
    },
    {
      code: "086",
      name: "Pediatric Neurosurgery                  ",
    },
    {
      code: "087",
      name: "Laproscopic,Metabolic &Beriatric Surgery",
    },
    {
      code: "088",
      name: "Pathology                               ",
    },
    {
      code: "089",
      name: "Orthopaedic Oncologist                  ",
    },
    {
      code: "090",
      name: "Maxillofacial Surgery                   ",
    },
    {
      code: "091",
      name: "Sachin                                  ",
    },
  ],
  error: null,
};
export const SLOT_AVAIL = {
  status: true,
  success: [
    {
      slotNo: 1,
      slot: "08:00",
    },
    {
      slotNo: 2,
      slot: "08:15",
    },
    {
      slotNo: 3,
      slot: "08:30",
    },
    {
      slotNo: 4,
      slot: "08:45",
    },
    {
      slotNo: 5,
      slot: "09:00",
    },
    {
      slotNo: 6,
      slot: "09:15",
    },
    {
      slotNo: 7,
      slot: "09:30",
    },
    {
      slotNo: 8,
      slot: "09:45",
    },
    {
      slotNo: 9,
      slot: "10:00",
    },
    {
      slotNo: 10,
      slot: "10:15",
    },
    {
      slotNo: 11,
      slot: "10:30",
    },
    {
      slotNo: 12,
      slot: "10:45",
    },
    {
      slotNo: 13,
      slot: "11:00",
    },
    {
      slotNo: 14,
      slot: "11:15",
    },
    {
      slotNo: 15,
      slot: "11:30",
    },
    {
      slotNo: 16,
      slot: "11:45",
    },
    {
      slotNo: 17,
      slot: "12:00",
    },
    {
      slotNo: 18,
      slot: "12:15",
    },
    {
      slotNo: 19,
      slot: "12:30",
    },
    {
      slotNo: 20,
      slot: "12:45",
    },
    {
      slotNo: 21,
      slot: "13:45",
    },
    {
      slotNo: 22,
      slot: "14:00",
    },
    {
      slotNo: 23,
      slot: "14:15",
    },
    {
      slotNo: 24,
      slot: "14:30",
    },
    {
      slotNo: 25,
      slot: "14:45",
    },
    {
      slotNo: 26,
      slot: "15:00",
    },
    {
      slotNo: 27,
      slot: "15:15",
    },
    {
      slotNo: 28,
      slot: "15:30",
    },
    {
      slotNo: 29,
      slot: "15:45",
    },
    {
      slotNo: 30,
      slot: "16:00",
    },
    {
      slotNo: 31,
      slot: "16:15",
    },
    {
      slotNo: 32,
      slot: "16:30",
    },
    {
      slotNo: 33,
      slot: "16:45",
    },
    {
      slotNo: 34,
      slot: "17:00",
    },
    {
      slotNo: 35,
      slot: "17:15",
    },
    {
      slotNo: 36,
      slot: "17:30",
    },
    {
      slotNo: 37,
      slot: "17:45",
    },
    {
      slotNo: 38,
      slot: "18:00",
    },
    {
      slotNo: 39,
      slot: "18:15",
    },
    {
      slotNo: 40,
      slot: "18:30",
    },
    {
      slotNo: 41,
      slot: "18:45",
    },
    {
      slotNo: 42,
      slot: "19:00",
    },
    {
      slotNo: 43,
      slot: "19:15",
    },
    {
      slotNo: 44,
      slot: "19:30",
    },
    {
      slotNo: 45,
      slot: "19:45",
    },
    {
      slotNo: 46,
      slot: "20:00",
    },
  ],
  error: null,
};

export const refundList = [
  { label: "Cash", value: "C" },
  { label: "ECS", value: "E" },
];

export const bankDetailsAvailablityList = [
  { label: "Yes", value: "Y" },
  { label: "No", value: "N" },
];

export const bankDetailsRelationList = [
  { label: "Self", value: "S" },
  { label: "Next of Kin", value: "K" },
  { label: "Other", value: "O" },
];
