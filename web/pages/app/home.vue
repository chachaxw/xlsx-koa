<template>
    <div id="home-app">
        <div class="page-header">XLSX-KOA</div>
        <div class="container-fluid">
            <div class="upload">
                <file-upload
                    :drop="true"
                    ref="upload"
                    v-model="files"
                    :accept="accept"
                    :size="size || 0"
                    :thread="thread"
                    :maximum="maximum"
                    :multiple="multiple"
                    post-action="/api/upload"
                    @input-file="inputFile"
                    @input-filter="inputFilter"
                >
                    选择文件
                </file-upload>
            </div>
            <ul class="file-list">
                <li v-for="file in files">
                    <div class="progress" :style="{
                        width: file.progress + '%',
                        backgroundColor: file.success ? '#1b94f7' : '#FF3B30',
                    }"></div>
                    <div class="file-info">
                        {{file.name}} - {{file.progress + '%'}}
                        {{file.error && `Error: ${file.error}`}}
                    </div>
                </li>
            </ul>
        </div>
        <p class="upload-tips" v-show="$refs.upload && $refs.upload.dropActive">
            拖拽到此处上传文件
        </p>
        <back-to-top></back-to-top>
    </div>
</template>
<script>
    import FileUpload from 'vue-upload-component';
    import backToTop from '../../components/back-to-top';

    export default {
        data() {
            return {
                files: [],
                thread: 3,
                maximum: 10,
                minSize: 1024,
                multiple: true,
                uploadAuto: true,
                size: 1024 * 1024 * 100,
                accept: 'text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            };
        },
        methods: {
            /**
             * Has changed
             * @param  Object|undefined   newFile   Read only
             * @param  Object|undefined   oldFile   Read only
             * @return undefined
             */
            inputFile: function (newFile, oldFile) {
                if (newFile && oldFile) {
                    // update

                    if (newFile.active && !oldFile.active) {
                        // beforeSend
                        // min size
                        if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
                            this.$refs.upload.update(newFile, { error: 'size' })
                        }
                    }
                    if (newFile.progress !== oldFile.progress) {
                        // progress
                    }
                    if (newFile.error && !oldFile.error) {
                        // error
                    }
                    if (newFile.success && !oldFile.success) {
                        // success
                    }
                }

                if (!newFile && oldFile) {
                    // remove
                    if (oldFile.success && oldFile.response.id) {
                    // $.ajax({
                    //   type: 'DELETE',
                    //   url: '/upload/delete?id=' + oldFile.response.id,
                    // })
                    }
                }

                // Automatically activate upload
                if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
                    if (this.uploadAuto && !this.$refs.upload.active) {
                        console.log('Upload File', newFile);
                        this.$refs.upload.active = true;
                    }
                }
            },
            /**
             * Pretreatment
             * @param  Object|undefined   newFile   Read and write
             * @param  Object|undefined   oldFile   Read only
             * @param  Function           prevent   Prevent changing
             * @return undefined
             */
            inputFilter: function (newFile, oldFile, prevent) {
                if (newFile && !oldFile) {
                    // Filter non-excel file
                    if (!/\.(xlsx|xls|csv)$/i.test(newFile.name)) {
                        return prevent();
                    }
                }

                // Create a blob field
                newFile.blob = '';
                let URL = window.URL || window.webkitURL;

                if (URL && URL.createObjectURL) {
                    newFile.blob = URL.createObjectURL(newFile.file);
                }
            }
        },
        watch: {
            'files': (newVal, oldVal) => {
                // console.log(newVal, oldVal);
            }
        },
        components:{
            backToTop,
            FileUpload,
        }
    }
</script>
<style lang="scss" scoped>

    #home-app {
        height: 100%;
    }

    .page-header {
        text-align: center;
        font-size: 18px;
        margin: 0;
        height: 64px;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ffffff;
        box-shadow: 1px 5px 40px rgba(0, 0, 0, .08);
    }

    .container-fluid {
        width: 100%;
        padding: 0;
        position: relative;
        height: calc(100% - 74px);
    }

    .upload {
        position: absolute;
        top: 200px;
        left: 50%;
        display: flex;
        flex-direction: column;
        width: 50%;
        height: 120px;
        margin: 0 auto;
        border-radius: 5px;
        align-items: center;
        justify-content: center;
        border: 2px dashed #dddddd;
        transform: translateX(-50%);

        &.drop-active {
            border-color: rgb(41, 154, 230);
        }

        .file-uploads {
            display: flex;
            width: 180px;
            height: 40px;
            color: #fff;
            cursor: pointer;
            justify-content: center;
            align-items: center;
            border-radius: 3px;
            background-color: rgb(41, 154, 230);

            &:hover {
                background-color: rgba(41, 154, 230, .8);
            }
        }
    }

    .upload-tips {
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: 0;
        position: fixed;
        display: flex;
        z-index: 9999;
        color: #f2f2f2;
        font-size: 16px;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, .5);
    }

    .lang {
        font-size: 30px;
    }

    .file-list {
        width: 50%;
        text-align: center;
        margin: 20px auto;

        li {
            color: #fff;
            position: relative;
            background-color: #d6d6d6;
            border-radius: 4px;
            padding: 5px 8px;
            margin-bottom: 5px;
            overflow: hidden;
        }

        .progress {
            width: 0;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 0;
            border-radius: 4px;
            background-color: #d6d6d6;
        }

        .file-info {
            position: relative;
            z-index: 1;
        }
    }
</style>
