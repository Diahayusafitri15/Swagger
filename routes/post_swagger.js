module.exports = {
    paths: {
        '/posts': {
            get: {
                tags: ['Posts'],
                summary: 'Ambil semua post',
                security: [],
                responses: { 200: { description: 'Berhasil' } }
            },
            post: {
                tags: ['Posts'],
                summary: 'Tambah post',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true, 
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                // SEKARANG GAMBAR JUGA WAJIB
                                required: ['judul', 'isi', 'gambar'], 
                                properties: {
                                    judul: { 
                                        type: 'string',
                                        minLength: 1,
                                        example: '' 
                                    },
                                    isi: { 
                                        type: 'string',
                                        minLength: 1,
                                        example: '' 
                                    },
                                    gambar: { 
                                        type: 'string', 
                                        format: 'binary',
                                        description: 'File gambar wajib diunggah'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Post dibuat' } }
            }
        },

        '/posts/{id}': {
            put: {
                tags: ['Posts'],
                summary: 'Update post',
                security: [{ bearerAuth: [] }],
                parameters: [{ 
                    name: 'id', 
                    in: 'path', 
                    required: true,
                    schema: { type: 'integer' }
                }],
                requestBody: {
                    required: true, 
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                // DI UPDATE JUGA WAJIB ISI SEMUA
                                required: ['judul', 'isi', 'gambar'], 
                                properties: {
                                    judul: { 
                                        type: 'string',
                                        minLength: 1,
                                        example: '' 
                                    },
                                    isi: { 
                                        type: 'string',
                                        minLength: 1,
                                        example: '' 
                                    },
                                    gambar: { 
                                        type: 'string', 
                                        format: 'binary' 
                                    }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Post diupdate' } }
            },
            delete: {
                tags: ['Posts'],
                summary: 'Hapus post',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true }],
                responses: { 200: { description: 'Post dihapus' } }
            }
        }
    }
};