const createApplicationDefaultFragments = `
  _id,
  createdAt,
  name
`;

export function createApplication (data, fragments = createApplicationDefaultFragments) {
  return {
    query: `
      mutation createApplication ($data: ApplicationInput!) {
        createApplication(data: $data) {
          ${fragments}
        }
      }
    `,
    params: {
      data
    }
  };
}

const updateApplicationDefaultFragments = `
  _id,
  createdAt,
  name
`;

export function updateApplication (application, fragments = updateApplicationDefaultFragments) {
  return {
    query: `
      mutation updateApplication ($applicationId: String!, $data: ApplicationInput!) {
        updateApplication (_id: $applicationId, data: $data) {
          ${fragments}
        }
      }
    `,
    params: {
      applicationId: application._id,
      data: application
    }
  };
}

const addApplicationSourceDefaultFragments = `
  _id,
  filename,
  extension
`;

export function addApplicationSource (applicationId, data, fragments = addApplicationSourceDefaultFragments) {
  return {
    query: `
      mutation addSourceToApplication ($applicationId: String!, $data: ApplicationSourceInput!) {
        addSourceToApplication(applicationId: $applicationId, data: $data) {
          ${fragments}
        }
      }
    `,
    params: {
      applicationId,
      data
    }
  };
}

const updateApplicationSourceDefaultFragments = `
  _id,
  filename,
  extension
`;

export function updateApplicationSource (applicationSource, fragments = updateApplicationSourceDefaultFragments) {
  return {
    query: `
      mutation updateApplicationSource ($sourceId: String!, $data: ApplicationSourceInput!) {
        updateApplicationSource(_id: $sourceId, data: $data) {
          ${fragments}
        }
      }
    `,
    params: {
      sourceId: applicationSource._id,
      data: applicationSource
    }
  };
}

const removeSourceFromApplicationDefaultFragments = `
`;

export function removeSourceFromApplication (sourceId, applicationId, fragments = removeSourceFromApplicationDefaultFragments) {
  return {
    query: `
      mutation removeSource ($_id: String!, $applicationId: String!) {
        removeSource (_id: $_id, applicationId: $applicationId) {
          ${fragments}
        }
      }
    `,
    params: {
      _id: sourceId,
      applicationId
    }
  };
}

const createTemplateDefaultFragments = `
  _id,
  name,
  description,
  parameters
`;

export function createTemplate (template, fragments = createTemplateDefaultFragments) {
  return {
    query: `
      mutation createTemplate ($data: TemplateInput!) {
        createTemplate (data: $data) {
          ${fragments}
        }
      }
    `,
    params: {
      data: template
    }
  };
}
