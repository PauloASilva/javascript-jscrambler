const getApplicationDefaultFragments = `
  _id,
  name,
  createdAt,
  sources {
    _id,
    filename,
    extension
  }
`;

export function getApplication (applicationId, fragments = getApplicationDefaultFragments) {
  return {
    query: `
      query getApplication ($applicationId: String!) {
        application(_id: $applicationId) {
          ${fragments}
        }
      }
    `,
    params: JSON.stringify({
      applicationId
    })
  };
}

const getApplicationSourceDefaultFragments = `
  _id,
  filename,
  extension
`;

export function getApplicationSource (sourceId, fragments = getApplicationSourceDefaultFragments, limits) {
  return {
    query: `
      query getApplicationSource ($sourceId: String!, $contentLimit: Int, $transformedLimit: Int) {
        applicationSource(_id: $sourceId, contentLimit: $contentLimit, transformedLimit: $transformedLimit) {
          ${fragments}
        }
      }
    `,
    params: JSON.stringify({
      sourceId,
      ...limits
    })
  };
}

const getApplicationProtectionsDefaultFragments = `
  _id,
  sources,
  parameters,
  finishedAt
`;

export function getApplicationProtections (applicationId, params, fragments = getApplicationProtectionsDefaultFragments) {
  return {
    query: `
      query getApplicationProtections ($applicationId: String!, $sort: String, $order: String, $limit: Int, $page: Int) {
        applicationProtections(_id: $applicationId, sort: $sort, order: $order, limit: $limit, page: $page) {
          ${fragments}
        }
      }
    `,
    params: JSON.stringify({
      applicationId,
      ...params
    })
  };
}

const getApplicationProtectionsCountDefaultFragments = `
  count
`;

export function getApplicationProtectionsCount (applicationId, fragments = getApplicationProtectionsCountDefaultFragments) {
  return {
    query: `
      query getApplicationProtectionsCount ($applicationId: String!) {
        applicationProtectionsCount(_id: $applicationId) {
          ${fragments}
        }
      }
    `,
    params: JSON.stringify({
      applicationId
    })
  };
}

const getTemplatesDefaultFragments = `
  _id,
  parameters
`;

export function getTemplates (fragments = getTemplatesDefaultFragments) {
  return {
    query: `
      query getTemplates {
        templates {
          ${fragments}
        }
      }
    `,
    params: '{}'
  };
}

const getApplicationsDefaultFragments = `
  _id,
  name,
  protections,
  parameters
`;

export function getApplications (fragments = getApplicationsDefaultFragments) {
  return {
    query: `
      query getApplications {
        applications {
          ${fragments}
        }
      }
    `,
    params: '{}'
  };
}

const getProtectionDefaultFragments = {
  application: `
    name
  `,
  applicationProtection: `
    _id,
    state
  `
};

export function getProtection (applicationId, protectionId, fragments = getProtectionDefaultFragments) {
  return {
    query: `
      query getProtection ($applicationId: String!, $protectionId: String!) {
        application (_id: $applicationId) {
          ${fragments.application}
        }
        applicationProtection (_id: $protectionId) {
          ${fragments.applicationProtection}
        }
      }
    `,
    params: JSON.stringify({
      applicationId,
      protectionId
    })
  };
}
