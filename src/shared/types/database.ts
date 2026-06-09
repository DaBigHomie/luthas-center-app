// Hand-derived Database types for Luthas Center.
// Shaped like `supabase gen types` output so it can be swapped for generated
// types without touching any import sites.
// Source of truth: supabase/migrations/20260608000001–00008.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ---------------------------------------------------------------------------
// Enum types (mirrors public.* PG enums in the migrations)
// ---------------------------------------------------------------------------

export type ProfileRole = 'student' | 'author' | 'admin' | 'owner'
export type CourseStatus = 'publish' | 'pending'
export type LmsContentStatus = 'publish' | 'pending' | 'draft' | 'private'
export type CourseStepType = 'lesson' | 'quiz' | 'topic'
export type PostStatus = 'publish' | 'draft'
export type CatalogKind = 'course' | 'product'

// ---------------------------------------------------------------------------
// Database shape
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      // -----------------------------------------------------------------------
      // profiles
      // -----------------------------------------------------------------------
      profiles: {
        Row: {
          id: string
          wp_user_id: number | null
          username: string | null
          display_name: string | null
          email: string | null
          role: ProfileRole
          avatar_media_id: number | null
          bio: string | null
          created_at: string
          updated_at: string
          auth_user_id: string | null
        }
        Insert: {
          id?: string
          wp_user_id?: number | null
          username?: string | null
          display_name?: string | null
          email?: string | null
          role?: ProfileRole
          avatar_media_id?: number | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          auth_user_id?: string | null
        }
        Update: {
          id?: string
          wp_user_id?: number | null
          username?: string | null
          display_name?: string | null
          email?: string | null
          role?: ProfileRole
          avatar_media_id?: number | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          auth_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_avatar_media_fk'
            columns: ['avatar_media_id']
            isOneToOne: false
            referencedRelation: 'media'
            referencedColumns: ['wp_attachment_id']
          },
          {
            foreignKeyName: 'profiles_auth_user_id_fkey'
            columns: ['auth_user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }

      // -----------------------------------------------------------------------
      // media
      // -----------------------------------------------------------------------
      media: {
        Row: {
          id: string
          wp_attachment_id: number
          storage_path: string | null
          public_url: string | null
          source_url: string | null
          attached_file: string | null
          mime_type: string | null
          width: number | null
          height: number | null
          alt_text: string | null
          title: string | null
          post_parent: number | null
          sizes: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          wp_attachment_id: number
          storage_path?: string | null
          public_url?: string | null
          source_url?: string | null
          attached_file?: string | null
          mime_type?: string | null
          width?: number | null
          height?: number | null
          alt_text?: string | null
          title?: string | null
          post_parent?: number | null
          sizes?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          wp_attachment_id?: number
          storage_path?: string | null
          public_url?: string | null
          source_url?: string | null
          attached_file?: string | null
          mime_type?: string | null
          width?: number | null
          height?: number | null
          alt_text?: string | null
          title?: string | null
          post_parent?: number | null
          sizes?: Json | null
          created_at?: string
        }
        Relationships: []
      }

      // -----------------------------------------------------------------------
      // terms
      // -----------------------------------------------------------------------
      terms: {
        Row: {
          id: string
          wp_term_id: number
          name: string
          slug: string
          taxonomy: string
          parent_id: number | null
          count: number
          created_at: string
        }
        Insert: {
          id?: string
          wp_term_id: number
          name: string
          slug: string
          taxonomy: string
          parent_id?: number | null
          count?: number
          created_at?: string
        }
        Update: {
          id?: string
          wp_term_id?: number
          name?: string
          slug?: string
          taxonomy?: string
          parent_id?: number | null
          count?: number
          created_at?: string
        }
        Relationships: []
      }

      // -----------------------------------------------------------------------
      // term_relationships
      // -----------------------------------------------------------------------
      term_relationships: {
        Row: {
          id: string
          object_type: string
          object_id: number
          wp_term_id: number
          taxonomy: string | null
          created_at: string
        }
        Insert: {
          id?: string
          object_type: string
          object_id: number
          wp_term_id: number
          taxonomy?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          object_type?: string
          object_id?: number
          wp_term_id?: number
          taxonomy?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'term_relationships_wp_term_id_fkey'
            columns: ['wp_term_id']
            isOneToOne: false
            referencedRelation: 'terms'
            referencedColumns: ['wp_term_id']
          },
        ]
      }

      // -----------------------------------------------------------------------
      // seo_meta
      // -----------------------------------------------------------------------
      seo_meta: {
        Row: {
          id: string
          object_type: string
          object_id: number
          meta_title: string | null
          meta_description: string | null
          og_image_media_id: number | null
          focus_keyword: string | null
          created_at: string
        }
        Insert: {
          id?: string
          object_type: string
          object_id: number
          meta_title?: string | null
          meta_description?: string | null
          og_image_media_id?: number | null
          focus_keyword?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          object_type?: string
          object_id?: number
          meta_title?: string | null
          meta_description?: string | null
          og_image_media_id?: number | null
          focus_keyword?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'seo_meta_og_image_media_id_fkey'
            columns: ['og_image_media_id']
            isOneToOne: false
            referencedRelation: 'media'
            referencedColumns: ['wp_attachment_id']
          },
        ]
      }

      // -----------------------------------------------------------------------
      // pages
      // -----------------------------------------------------------------------
      pages: {
        Row: {
          id: string
          wp_id: number
          slug: string
          title: string | null
          content: string | null
          excerpt: string | null
          status: string
          parent_id: number | null
          menu_order: number
          page_template: string | null
          author_id: number | null
          featured_image_id: number | null
          published_at: string | null
          modified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          wp_id: number
          slug: string
          title?: string | null
          content?: string | null
          excerpt?: string | null
          status?: string
          parent_id?: number | null
          menu_order?: number
          page_template?: string | null
          author_id?: number | null
          featured_image_id?: number | null
          published_at?: string | null
          modified_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          wp_id?: number
          slug?: string
          title?: string | null
          content?: string | null
          excerpt?: string | null
          status?: string
          parent_id?: number | null
          menu_order?: number
          page_template?: string | null
          author_id?: number | null
          featured_image_id?: number | null
          published_at?: string | null
          modified_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'pages_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['wp_user_id']
          },
          {
            foreignKeyName: 'pages_featured_image_id_fkey'
            columns: ['featured_image_id']
            isOneToOne: false
            referencedRelation: 'media'
            referencedColumns: ['wp_attachment_id']
          },
        ]
      }

      // -----------------------------------------------------------------------
      // courses
      // -----------------------------------------------------------------------
      courses: {
        Row: {
          id: string
          wp_id: number
          status: CourseStatus
          slug: string
          title: string | null
          content: string | null
          excerpt: string | null
          short_description: string | null
          price_type: string | null
          price: number | null
          access_mode: string | null
          certificate_id: number | null
          intro_video: string | null
          materials_enabled: boolean
          menu_order: number
          steps_source: string | null
          step_counts: Json | null
          featured_image_id: number | null
          cover_image_id: number | null
          old_path: string | null
          new_path: string | null
          published_at: string | null
          modified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          wp_id: number
          status?: CourseStatus
          slug: string
          title?: string | null
          content?: string | null
          excerpt?: string | null
          short_description?: string | null
          price_type?: string | null
          price?: number | null
          access_mode?: string | null
          certificate_id?: number | null
          intro_video?: string | null
          materials_enabled?: boolean
          menu_order?: number
          steps_source?: string | null
          step_counts?: Json | null
          featured_image_id?: number | null
          cover_image_id?: number | null
          old_path?: string | null
          new_path?: string | null
          published_at?: string | null
          modified_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          wp_id?: number
          status?: CourseStatus
          slug?: string
          title?: string | null
          content?: string | null
          excerpt?: string | null
          short_description?: string | null
          price_type?: string | null
          price?: number | null
          access_mode?: string | null
          certificate_id?: number | null
          intro_video?: string | null
          materials_enabled?: boolean
          menu_order?: number
          steps_source?: string | null
          step_counts?: Json | null
          featured_image_id?: number | null
          cover_image_id?: number | null
          old_path?: string | null
          new_path?: string | null
          published_at?: string | null
          modified_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'courses_featured_image_id_fkey'
            columns: ['featured_image_id']
            isOneToOne: false
            referencedRelation: 'media'
            referencedColumns: ['wp_attachment_id']
          },
          {
            foreignKeyName: 'courses_cover_image_id_fkey'
            columns: ['cover_image_id']
            isOneToOne: false
            referencedRelation: 'media'
            referencedColumns: ['wp_attachment_id']
          },
        ]
      }

      // -----------------------------------------------------------------------
      // lessons
      // -----------------------------------------------------------------------
      lessons: {
        Row: {
          id: string
          wp_id: number
          course_id: number | null
          slug: string
          title: string | null
          content: string | null
          excerpt: string | null
          sort_order: number
          status: LmsContentStatus
          video_url: string | null
          featured_image_id: number | null
          old_path: string | null
          new_path: string | null
          published_at: string | null
          modified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          wp_id: number
          course_id?: number | null
          slug: string
          title?: string | null
          content?: string | null
          excerpt?: string | null
          sort_order?: number
          status?: LmsContentStatus
          video_url?: string | null
          featured_image_id?: number | null
          old_path?: string | null
          new_path?: string | null
          published_at?: string | null
          modified_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          wp_id?: number
          course_id?: number | null
          slug?: string
          title?: string | null
          content?: string | null
          excerpt?: string | null
          sort_order?: number
          status?: LmsContentStatus
          video_url?: string | null
          featured_image_id?: number | null
          old_path?: string | null
          new_path?: string | null
          published_at?: string | null
          modified_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'lessons_course_id_fkey'
            columns: ['course_id']
            isOneToOne: false
            referencedRelation: 'courses'
            referencedColumns: ['wp_id']
          },
          {
            foreignKeyName: 'lessons_featured_image_id_fkey'
            columns: ['featured_image_id']
            isOneToOne: false
            referencedRelation: 'media'
            referencedColumns: ['wp_attachment_id']
          },
        ]
      }

      // -----------------------------------------------------------------------
      // quizzes
      // -----------------------------------------------------------------------
      quizzes: {
        Row: {
          id: string
          wp_id: number
          course_id: number | null
          lesson_id: number | null
          slug: string
          title: string | null
          content: string | null
          excerpt: string | null
          status: LmsContentStatus
          pro_quiz_id: number | null
          passing_percentage: number | null
          featured_image_id: number | null
          old_path: string | null
          new_path: string | null
          published_at: string | null
          modified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          wp_id: number
          course_id?: number | null
          lesson_id?: number | null
          slug: string
          title?: string | null
          content?: string | null
          excerpt?: string | null
          status?: LmsContentStatus
          pro_quiz_id?: number | null
          passing_percentage?: number | null
          featured_image_id?: number | null
          old_path?: string | null
          new_path?: string | null
          published_at?: string | null
          modified_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          wp_id?: number
          course_id?: number | null
          lesson_id?: number | null
          slug?: string
          title?: string | null
          content?: string | null
          excerpt?: string | null
          status?: LmsContentStatus
          pro_quiz_id?: number | null
          passing_percentage?: number | null
          featured_image_id?: number | null
          old_path?: string | null
          new_path?: string | null
          published_at?: string | null
          modified_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'quizzes_course_id_fkey'
            columns: ['course_id']
            isOneToOne: false
            referencedRelation: 'courses'
            referencedColumns: ['wp_id']
          },
          {
            foreignKeyName: 'quizzes_lesson_id_fkey'
            columns: ['lesson_id']
            isOneToOne: false
            referencedRelation: 'lessons'
            referencedColumns: ['wp_id']
          },
          {
            foreignKeyName: 'quizzes_featured_image_id_fkey'
            columns: ['featured_image_id']
            isOneToOne: false
            referencedRelation: 'media'
            referencedColumns: ['wp_attachment_id']
          },
        ]
      }

      // -----------------------------------------------------------------------
      // course_steps
      // -----------------------------------------------------------------------
      course_steps: {
        Row: {
          id: string
          course_id: number
          step_type: CourseStepType
          step_ref_id: number
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: number
          step_type: CourseStepType
          step_ref_id: number
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: number
          step_type?: CourseStepType
          step_ref_id?: number
          position?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'course_steps_course_id_fkey'
            columns: ['course_id']
            isOneToOne: false
            referencedRelation: 'courses'
            referencedColumns: ['wp_id']
          },
        ]
      }

      // -----------------------------------------------------------------------
      // enrollments
      // -----------------------------------------------------------------------
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: number
          progress: number
          completed_at: string | null
          enrolled_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: number
          progress?: number
          completed_at?: string | null
          enrolled_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: number
          progress?: number
          completed_at?: string | null
          enrolled_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'enrollments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'enrollments_course_id_fkey'
            columns: ['course_id']
            isOneToOne: false
            referencedRelation: 'courses'
            referencedColumns: ['wp_id']
          },
        ]
      }

      // -----------------------------------------------------------------------
      // posts
      // -----------------------------------------------------------------------
      posts: {
        Row: {
          id: string
          wp_id: number
          slug: string
          title: string | null
          content: string | null
          excerpt: string | null
          status: PostStatus
          author_id: number | null
          featured_image_id: number | null
          reading_time: number | null
          old_path: string | null
          new_path: string | null
          published_at: string | null
          modified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          wp_id: number
          slug: string
          title?: string | null
          content?: string | null
          excerpt?: string | null
          status?: PostStatus
          author_id?: number | null
          featured_image_id?: number | null
          reading_time?: number | null
          old_path?: string | null
          new_path?: string | null
          published_at?: string | null
          modified_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          wp_id?: number
          slug?: string
          title?: string | null
          content?: string | null
          excerpt?: string | null
          status?: PostStatus
          author_id?: number | null
          featured_image_id?: number | null
          reading_time?: number | null
          old_path?: string | null
          new_path?: string | null
          published_at?: string | null
          modified_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'posts_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['wp_user_id']
          },
          {
            foreignKeyName: 'posts_featured_image_id_fkey'
            columns: ['featured_image_id']
            isOneToOne: false
            referencedRelation: 'media'
            referencedColumns: ['wp_attachment_id']
          },
        ]
      }

      // -----------------------------------------------------------------------
      // products
      // -----------------------------------------------------------------------
      products: {
        Row: {
          id: string
          wp_id: number
          slug: string
          title: string | null
          description: string | null
          short_description: string | null
          status: string
          sku: string | null
          regular_price: number | null
          sale_price: number | null
          price: number | null
          virtual: boolean
          downloadable: boolean
          download_limit: number | null
          download_expiry: number | null
          stock_status: string
          average_rating: number
          review_count: number
          total_sales: number
          featured_image_id: number | null
          menu_order: number
          old_path: string | null
          new_path: string | null
          published_at: string | null
          modified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          wp_id: number
          slug: string
          title?: string | null
          description?: string | null
          short_description?: string | null
          status?: string
          sku?: string | null
          regular_price?: number | null
          sale_price?: number | null
          price?: number | null
          virtual?: boolean
          downloadable?: boolean
          download_limit?: number | null
          download_expiry?: number | null
          stock_status?: string
          average_rating?: number
          review_count?: number
          total_sales?: number
          featured_image_id?: number | null
          menu_order?: number
          old_path?: string | null
          new_path?: string | null
          published_at?: string | null
          modified_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          wp_id?: number
          slug?: string
          title?: string | null
          description?: string | null
          short_description?: string | null
          status?: string
          sku?: string | null
          regular_price?: number | null
          sale_price?: number | null
          price?: number | null
          virtual?: boolean
          downloadable?: boolean
          download_limit?: number | null
          download_expiry?: number | null
          stock_status?: string
          average_rating?: number
          review_count?: number
          total_sales?: number
          featured_image_id?: number | null
          menu_order?: number
          old_path?: string | null
          new_path?: string | null
          published_at?: string | null
          modified_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_featured_image_id_fkey'
            columns: ['featured_image_id']
            isOneToOne: false
            referencedRelation: 'media'
            referencedColumns: ['wp_attachment_id']
          },
        ]
      }

      // -----------------------------------------------------------------------
      // product_attributes
      // -----------------------------------------------------------------------
      product_attributes: {
        Row: {
          id: string
          product_id: number
          name: string
          value: string | null
          position: number
          is_variation: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: number
          name: string
          value?: string | null
          position?: number
          is_variation?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: number
          name?: string
          value?: string | null
          position?: number
          is_variation?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_attributes_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['wp_id']
          },
        ]
      }

      // -----------------------------------------------------------------------
      // donation_forms
      // -----------------------------------------------------------------------
      donation_forms: {
        Row: {
          id: string
          wp_id: number
          slug: string | null
          title: string | null
          content: string | null
          status: string
          goal_enabled: boolean
          goal_amount: number | null
          goal_format: string | null
          price_option: string | null
          set_price: number | null
          custom_amount: boolean
          price_levels: Json | null
          image_id: number | null
          published_at: string | null
          modified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          wp_id: number
          slug?: string | null
          title?: string | null
          content?: string | null
          status?: string
          goal_enabled?: boolean
          goal_amount?: number | null
          goal_format?: string | null
          price_option?: string | null
          set_price?: number | null
          custom_amount?: boolean
          price_levels?: Json | null
          image_id?: number | null
          published_at?: string | null
          modified_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          wp_id?: number
          slug?: string | null
          title?: string | null
          content?: string | null
          status?: string
          goal_enabled?: boolean
          goal_amount?: number | null
          goal_format?: string | null
          price_option?: string | null
          set_price?: number | null
          custom_amount?: boolean
          price_levels?: Json | null
          image_id?: number | null
          published_at?: string | null
          modified_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'donation_forms_image_id_fkey'
            columns: ['image_id']
            isOneToOne: false
            referencedRelation: 'media'
            referencedColumns: ['wp_attachment_id']
          },
        ]
      }

      // -----------------------------------------------------------------------
      // donation_stats
      // -----------------------------------------------------------------------
      donation_stats: {
        Row: {
          id: string
          form_id: number
          total_earnings: number
          total_sales: number
          updated_at: string
        }
        Insert: {
          id?: string
          form_id: number
          total_earnings?: number
          total_sales?: number
          updated_at?: string
        }
        Update: {
          id?: string
          form_id?: number
          total_earnings?: number
          total_sales?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'donation_stats_form_id_fkey'
            columns: ['form_id']
            isOneToOne: true
            referencedRelation: 'donation_forms'
            referencedColumns: ['wp_id']
          },
        ]
      }
    }

    Views: {
      // -----------------------------------------------------------------------
      // catalog_items — UNION view of published courses + products
      // -----------------------------------------------------------------------
      catalog_items: {
        Row: {
          id: string
          kind: CatalogKind
          wp_id: number
          slug: string
          title: string | null
          summary: string | null
          price: number | null
          image_id: number | null
          status: string
          published_at: string | null
        }
        // Views are read-only — no Insert/Update shapes needed
        Relationships: []
      }
    }

    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_owner: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }

    Enums: {
      profile_role: ProfileRole
      course_status: CourseStatus
      lms_content_status: LmsContentStatus
      course_step_type: CourseStepType
      post_status: PostStatus
      catalog_kind: CatalogKind
    }

    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ---------------------------------------------------------------------------
// Convenience aliases — mirror what supabase gen types exports
// ---------------------------------------------------------------------------

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Views<T extends keyof Database['public']['Views']> =
  Database['public']['Views'][T]['Row']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]
