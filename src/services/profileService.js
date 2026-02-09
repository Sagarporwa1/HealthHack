import { supabase } from './supabaseClient';

export const profileService = {
    /**
     * Save a new user profile
     * @param {string} userId - Supabase user ID
     * @param {object} profileData - Profile information
     */
    async saveProfile(userId, profileData) {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                full_name: profileData.fullName,
                date_of_birth: profileData.dateOfBirth,
                gender: profileData.gender,
                phone_number: profileData.phoneNumber,
                medical_conditions: profileData.medicalConditions,
                avatar_url: profileData.avatarUrl,
                profile_complete: true,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get user profile by user ID
     * @param {string} userId - Supabase user ID
     */
    async getProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
        return data;
    },

    /**
     * Update existing user profile
     * @param {string} userId - Supabase user ID
     * @param {object} updates - Fields to update
     */
    async updateProfile(userId, updates) {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Check if user has completed their profile
     * @param {string} userId - Supabase user ID
     */
    async isProfileComplete(userId) {
        try {
            const profile = await this.getProfile(userId);
            return profile?.profile_complete === true;
        } catch {
            return false;
        }
    },

    /**
     * Get user email from auth
     */
    async getUserEmail() {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.email || '';
    },

    /**
     * Get member since date
     */
    async getMemberSince() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.created_at) {
            return new Date(user.created_at).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
            });
        }
        return 'Unknown';
    }
};
