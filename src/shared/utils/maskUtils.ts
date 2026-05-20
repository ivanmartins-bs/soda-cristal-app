export const maskPhone = (value: string) => {
  if (!value) return '';
  value = value.replace(/\D/g, ''); // Remove all non-digits
  if (value.length > 11) value = value.substring(0, 11);

  if (value.length > 10) {
    // 11 digits: (XX) XXXXX-XXXX
    return value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else if (value.length > 6) {
    // 10 digits or less but more than 6: (XX) XXXX-XXXX
    return value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else if (value.length > 2) {
    // Between 3 and 6 digits: (XX) XXXX
    return value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else if (value.length > 0) {
    // 1 or 2 digits: (XX
    return value.replace(/^(\d{0,2})/, '($1');
  }
  return value;
};

export const maskCpfCnpj = (value: string) => {
  if (!value) return '';
  value = value.replace(/\D/g, '');

  if (value.length <= 11) {
    // CPF
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    // CNPJ
    if (value.length > 14) value = value.substring(0, 14);
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  }
  return value;
};

export const maskCep = (value: string) => {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  if (value.length > 8) value = value.substring(0, 8);
  return value.replace(/^(\d{5})(\d{1,3})/, '$1-$2');
};

export const maskDate = (value: string) => {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  if (value.length > 8) value = value.substring(0, 8);
  return value.replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2');
};
