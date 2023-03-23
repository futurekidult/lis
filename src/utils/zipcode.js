const patterns = {
  AND: /^(([a-zA-Z]{2}\d{3})|(\d{4}))$/,
  ARM_AZE_BEN_BLR_CHN_IND_KGZ_KAZ: /^[0-9]{6}$/,
  MNG_ROU_SRB_RUS_SGP_TJK_TKM_UZB: /^[0-9]{6}$/,
  ARG: /^((\d{4})|([a-zA-Z]{1}\d{4}[a-zA-Z]{3}))$/,
  ASM_BIH_CUB_DEU_DZA_EST_ESP_FIN: /^[0-9]{5}$/,
  FSM_GUF_GLP_GTM_GUM_HRV_IDN_ISR: /^[0-9]{5}$/,
  ITA_KEN_KWT_LTU_MAR_MNE_MHL_MMR: /^[0-9]{5}$/,
  MNP_MTQ_MEX_MYS_PAK_SPM_PRI_PSE: /^[0-9]{5}$/,
  PLW_REU_SAU_SMR_THA_TUR_UKR_URY_VIR_VNM_ZMB: /^[0-9]{5}$/,
  AUT_AUS_BGD_BEL_BGR_CHE_CXR_CYP: /^[0-9]{4}$/,
  DNK_GRL_GNB_HUN_LIE_LUX_MDA_MKD: /^[0-9]{4}$/,
  MOZ_NOR_NZL_PHL_SDN_SVN_TUN_VEN_XKX_ZAF: /^[0-9]{4}$/,
  BMU: /^[a-zA-Z]{2}\s\d{2}$/,
  BRN: /^[a-zA-Z]{2}\d{4}$/,
  BRA: /^(\d{5})(-\d{3})?$/,
  CAN: /^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$/,
  CZ_GR_SE_SK: /^[0-9]{3}\s?[0-9]{2}$/,
  FRO: /^([a-zA-Z]{2}-)?(\d{3})?$/,
  FRA: /^((0[1-9])|([1-8][0-9])|(9[0-8])|(2A)|(2B))[0-9]{3}$/,
  GBR: /^GIR?0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]|[A-HK-Y][0-9]([0-9]|[ABEHMNPRV-Y]))\s?|[0-9][A-HJKS-UW])?[0-9][ABD-HJLNP-UW-Z]{2}$/,
  GEO: /^((\d{4})|(\d{6}))$/,
  IRL: /^(([a-zA-Z]{2}(\s(([a-zA-Z0-9]{1})|(\d{2})))?)|([a-zA-Z]{3}))$/,
  ISL_MDG: /^[0-9]{3}$/,
  JPN: /^\d{3}(-\d{4})?$/,
  KOR: /^\d{3}(-)?\d{3}$/,
  LVA: /^([a-zA-Z]{2}-)?(\d{4})$/,
  MLT: /^[a-zA-Z]{3}\s\d{2,4}$/,
  MDV: /^\d{4,5}$/,
  MWI: /^\d{6,7}$/,
  NLD: /^(\d{4})\s?[a-zA-Z]{2}$/,
  POL: /^\d{2}(-)?\d{3}$/,
  PRT: /^\d{4}(-)?\d{3}$/,
  SWZ: /^[a-zA-Z]{1}\d{3}$/,
  TWN: /^\d{3}(\d{2})?$/,
  USA: /^\d{5}(-\d{4})?$/
};

let pattern = null;

// Check patterns.
export const checkPattern = (country) => {
  if (typeof patterns[country] !== 'undefined') {
    pattern = patterns[country];
  } else {
    for (let k in patterns) {
      if (patterns.hasOwnProperty(k) && k.indexOf(country) > 0) {
        pattern = patterns[k];
        break;
      }
    }
  }
  return pattern;
};
