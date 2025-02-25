const {validate, profiles} = require('@ban-team/validateur-bal')
const {getRevisionFile} = require('../util/api-depot.cjs')

function isErroredRow(row) {
  return row.errors.some(({level}) => level === 'E')
}

const defaultProfile = '1.3-relax'

async function importFromApiDepot(revision) {
  const revisionFile = await getRevisionFile(revision.id)

  if (!profiles[defaultProfile]) {
    throw new Error('Le profile du validateur n’existe pas')
  }

  const validationResult = await validate(revisionFile, {profile: defaultProfile})

  if (!validationResult.parseOk) {
    throw new Error(`Le fichier BAL récupéré n’est pas valide : ${revision.id}`)
  }

  return validationResult.rows.filter(r => !isErroredRow(r)).map(row => {
    const adresse = {
      dataSource: 'bal',
      source: 'bal',
      cleInterop: row.parsedValues.cle_interop,
      uidAdresse: row.parsedValues.uid_adresse,
      idBanCommune: row.parsedValues.id_ban_commune,
      idBanToponyme: row.parsedValues.id_ban_toponyme,
      idBanAdresse: row.parsedValues.id_ban_adresse,
      numero: row.parsedValues.numero,
      suffixe: row.parsedValues.suffixe,
      nomVoie: row.parsedValues.voie_nom,
      lieuDitComplementNom: row.parsedValues.lieudit_complement_nom,
      parcelles: row.parsedValues.cad_parcelles || [],
      codeCommune: row.parsedValues.commune_insee || row.additionalValues.cle_interop.codeCommune,
      nomCommune: row.parsedValues.commune_nom,
      codeAncienneCommune: row.parsedValues.commune_deleguee_insee,
      nomAncienneCommune: row.parsedValues.commune_deleguee_nom,
      certificationCommune: row.parsedValues.certification_commune || false,
      dateMAJ: row.parsedValues.date_der_maj,
      nomVoieAlt: row.localizedValues.voie_nom || {},
      lieuDitComplementNomAlt: row.localizedValues.lieudit_complement_nom || {}
    }

    if (row.parsedValues.long && row.parsedValues.lat) {
      adresse.position = {
        type: 'Point',
        coordinates: [row.parsedValues.long, row.parsedValues.lat]
      }

      adresse.positionType = row.parsedValues.position
    }

    return adresse
  })
}

module.exports = importFromApiDepot
