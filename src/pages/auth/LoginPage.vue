<template>
    <form @submit.prevent="onSubmit">
        <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div class="grid justify-content-center p-2 lg:p-0" style="min-width: 80%">
                <div
                    class="col-12 xl:col-6"
                    style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%)"
                >
                    <div
                        class="h-full w-full m-0 py-7 px-4"
                        style="border-radius: 53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0))"
                    >
                        <div class="text-right">
                            <DarkmodeSwitch />
                        </div>
                        <div class="text-center mb-5">
                            <div class="text-900 text-3xl font-medium mb-3">RH Skeleton</div>
                            <!--<span class="text-600 font-medium">Sign in to continue</span>-->
                        </div>

                        <div class="w-full md:w-10 mx-auto">
                            <div class="field">
                                <label for="userName" class="block text-900 text-xl font-medium mb-2">
                                    {{ t('UserName') }} <span style="color: red">*</span>
                                </label>
                                <PInputText
                                    id="userName"
                                    v-model="v$.userName.$model"
                                    type="text"
                                    class="w-full"
                                    :placeholder="t('UserName')"
                                    style="padding: 1rem"
                                    :class="{ 'p-invalid': v$.userName.$invalid && submitted }"
                                />
                                <small v-if="v$.userName.required.$invalid && submitted" class="p-error">
                                    {{ t('UserNameRequired') }}
                                </small>
                            </div>

                            <div class="field">
                                <label for="password" class="block text-900 font-medium text-xl mb-2">
                                    {{ t('Password') }} <span style="color: red">*</span>
                                </label>
                                <PPassword
                                    id="password"
                                    v-model="v$.password.$model"
                                    :placeholder="t('Password')"
                                    :toggleMask="true"
                                    class="w-full"
                                    inputClass="w-full"
                                    inputStyle="padding:1rem"
                                    :feedback="false"
                                    :class="{ 'p-invalid': v$.userName.$invalid && submitted }"
                                />
                                <small v-if="v$.password.required.$invalid && submitted" class="p-error">
                                    {{ t('PasswordRequired') }}
                                </small>
                            </div>

                            <div class="flex align-items-center justify-content-between mb-5" v-if="false">
                                <div class="flex align-items-center">
                                    <PCheckbox id="rememberme" v-model="v$.rememberMe.$model" :binary="true" class="mr-2" />
                                    <label for="rememberme">{{ t('RememberMe') }}</label>
                                </div>
                                <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">{{
                                    t('ForgotPassword')
                                }}</a>
                            </div>

                            <template v-if="state.loginError">
                                {{ state.loginError.status }}
                                <PMessage severity="error" :closable="false">
                                    <template v-if="state.loginError.response?.status === 401">
                                        {{ t('InvalidCredentials') }}
                                    </template>
                                    <template v-else-if="state.loginError.response?.status === 404">
                                        {{ t('PageNotFound') }}
                                    </template>
                                    <template v-else-if="state.loginError.code === 'ERR_BAD_RESPONSE'">
                                        {{ t('InternalServerError') }}
                                    </template>
                                    <template v-else>
                                        {{ t('UnknownError') }}
                                    </template>
                                </PMessage>
                            </template>

                            <PButton :loading="state.isLoginLoading" type="submit" :label="t('SignIn')" icon="pi pi-sign-in" class="w-full p-3 mt-3 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'

import { useAuthStore } from '@/store/auth.store'

import DarkmodeSwitch from '@/components/DarkmodeSwitch.vue'

const i18nMessages = {
    cs: {
        UserName: 'Uživatelské jméno',
        UserNameRequired: 'Uživatelské jméno musí být vyplněno',
        Password: 'Heslo',
        PasswordRequired: 'Heslo musí být vyplněno',
        RememberMe: 'Zůstat přihlášený',

        ForgotPassword: 'Zapomněli jste heslo?',

        SignIn: 'Přihlásit se',

        InvalidCredentials: 'Neplatné přihlašovací údaje',
        PageNotFound: 'Stránka nenalezena',
        InternalServerError: 'Vnitřní chyba serveru',
        UnknownError: 'Neznámá chyba',
    },
}

export default defineComponent({
    components: {
        DarkmodeSwitch,
    },
    setup() {
        const { t } = useI18n({ inheritLocale: true, useScope: 'local', messages: i18nMessages })
        const { state, logIn } = useAuthStore()

        const formData = reactive({
            userName: '',
            password: '',
            rememberMe: false,
        })

        const rules = {
            userName: { required },
            password: { required },
            rememberMe: {},
        }

        const submitted = ref(false)

        const v$ = useVuelidate(rules, formData)

        const onSubmit = () => {
            submitted.value = true

            if (v$.value.$invalid) {
                return
            }

            logIn(formData.userName, formData.password, formData.rememberMe)
        }

        return {
            v$,
            t,

            state,

            submitted,

            onSubmit,
        }
    },
})
</script>
