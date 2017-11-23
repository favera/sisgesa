<template>
    <div class="ui right floated pagination menu">
        <a class="icon item" @click.prevent="pageChanged(1)">
            <i class="left chevron icon"></i>
        </a>
        <a class="item" v-for="n in paginationRange" :class="activePage(n)" @click.prevent="pageChanged(n)">{{n}}</a>

        <a class="icon item" @click.prevent="pageChanged(lastPage)">
            <i class="right chevron icon"></i>
        </a>
    </div>
</template>

<script>
import Util from './Util'
export default {
    props: {
        // Current Page
        currentPage: {
            type: Number,
            required: true
        },
        // Total page
        totalPages: Number,
        // Items per page
        itemsPerPage: Number,
        // Total items
        totalItems: Number,
        // Visible Pages
        visiblePages: {
            type: Number,
            default: 5,
            coerce: (val) => parseInt(val)
        }
    },
    data() {
        return {}
    },
    computed: {
        lastPage() {
            if (this.totalPages) {
                return this.totalPages
            } else {
                return this.totalItems % this.itemsPerPage === 0
                    ? this.totalItems / this.itemsPerPage
                    : Math.floor(this.totalItems / this.itemsPerPage) + 1
            }
        },
        paginationRange() {
            let start = this.currentPage - this.visiblePages / 2 <= 0
                ? 1 : this.currentPage + this.visiblePages / 2 > this.lastPage
                    ? Util.lowerBound(this.lastPage - this.visiblePages + 1, 1)
                    : Math.ceil(this.currentPage - this.visiblePages / 2)
            let range = []
            for (let i = 0; i < this.visiblePages && i < this.lastPage; i++) {
                range.push(start + i)
            }
            return range
        }
    },
    methods: {
        pageChanged(pageNum) {
            this.$emit('page-changed', pageNum)
        },
        activePage(pageNum) {
            return this.currentPage === pageNum ? 'active' : ''
        }
    }
}
</script>
