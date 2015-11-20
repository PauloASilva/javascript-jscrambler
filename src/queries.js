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

export function getApplicationSource (sourceId, fragments = getApplicationSourceDefaultFragments) {
  return {
    query: `
      query getApplicationSource ($sourceId: String!) {
        applicationSource(_id: $sourceId) {
          ${fragments}
        }
      }
    `,
    params: JSON.stringify({
      sourceId
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
  }
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
  }
}
