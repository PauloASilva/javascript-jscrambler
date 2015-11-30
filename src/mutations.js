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

const duplicateApplicationDefaultFragments = `
  _id
`;

export function duplicateApplication (id, fragments = removeApplicationDefaultFragments) {
  return {
    query: `
      mutation duplicateApplication ($_id: String!) {
        duplicateApplication (_id: $_id) {
          ${fragments}
        }
      }
    `,
    params: {
      _id: id
    }
  };
}

const removeApplicationDefaultFragments = `
  _id
`;

export function removeApplication (id, fragments = removeApplicationDefaultFragments) {
  return {
    query: `
      mutation removeApplication ($_id: String!) {
        removeApplication (_id: $_id) {
          ${fragments}
        }
      }
    `,
    params: {
      _id: id
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

export function removeSourceFromApplication (filename, applicationId, fragments = removeSourceFromApplicationDefaultFragments) {
  return {
    query: `
      mutation removeSource ($filename: String!, $applicationId: String!) {
        removeSource (filename: $filename, applicationId: $applicationId) {
          ${fragments}
        }
      }
    `,
    params: {
      filename,
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

const removeTemplateDefaultFragments = `
  _id
`;

export function removeTemplate (id, fragments = removeTemplateDefaultFragments) {
  return {
    query: `
      mutation removeTemplate ($_id: String!) {
        removeTemplate (_id: $_id) {
          ${fragments}
        }
      }
    `,
    params: {
      _id: id
    }
  };
}

const updateTemplateDefaultFragments = `
  _id,
  parameters
`;

export function updateTemplate (template, fragments = updateTemplateDefaultFragments) {
  return {
    query: `
      mutation updateTemplate ($templateId: ID!, $data: TemplateInput!) {
        updateTemplate (_id: $templateId, data: $data) {
          ${fragments}
        }
      }
    `,
    params: {
      templateId: template._id,
      data: template
    }
  }
}

const createProtectionDefaultFragments = `
  _id,
  state
`;

export function createApplicationProtection (applicationId, fragments = createProtectionDefaultFragments) {
  return {
    query: `
      mutation createApplicationProtection ($applicationId: String!) {
        createApplicationProtection (applicationId: $applicationId) {
          ${fragments}
        }
      }
    `,
    params: {
      applicationId: applicationId
    }
  }
}
