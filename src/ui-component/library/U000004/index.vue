<template>
    <div :class="['component-wrapper', `component-${this.id}`]">

        <!-- style -->
        <div v-html="css"></div>

        <!-- 倒计时 -->
        <div class="timer">
            <div class="timer-title bold" v-if="datas.title">
                {{ datas.title }}
            </div>
            <div class="timer-right">
                <span class="timer-text bold">{{ spiner_text }}</span>
                <span class="timer-spiner">{{ spiner[0] }}</span>
                :
                <span class="timer-spiner">{{ spiner[1] }}</span>
                :
                <span class="timer-spiner">{{ spiner[2] }}</span>
                :
                <span class="timer-spiner">{{ spiner[3] }}</span>
            </div>
        </div>
    </div>
</template>

<script>
// 自定义样式
const css = function () {
    const {
        margin_top,
        margin_bottom,
        bg_color,
        text_color,
        time_text_bg_color,
        time_text_color,
    } = this.styles;

    return `
        .component-${this.id} {
            margin-top: ${this.$px2rem(margin_top)};
            margin-bottom: ${this.$px2rem(margin_bottom)};
            background-color: ${bg_color || '#FFFFFF'};
            font-size: ${this.$px2rem(24)};
        }
        .component-${this.id} .timer .timer-title {
            color: ${text_color};
        }
        .component-${this.id} .timer .timer-right {
            color: ${time_text_bg_color};
        }
        .component-${this.id} .timer span.timer-spiner {
            background-color: ${time_text_bg_color};
            color: ${time_text_color};
        }
    `;
};

/**
 * 返回剩余秒数，正整值
 * @param {timestamp} timestamp 时间戳
 */
const get_second = (timestamp) => {
    const now = new Date().getTime();
    let left = timestamp - now;
    left = Math.abs(left);
    const second = parseInt((left / 1000));
    return second;
};

/**
 * 判断当前的倒计时状态
 * @param {timestamp} start 开始的时间
 * @param {timestamp} end 结束的时间
 * @return {Number} 0=未开始，1=正在开始，2=已经结束
 */
const get_status = (start, end) => {
    const now = new Date().getTime();
    if (now < start) {
        return 0;
    }
    if (now >= start && now < end) {
        return 1;
    }
    if (now >= end) {
        return 2;
    }
};

/**
 * 秒数转换成日期
 * @param {Number} s 秒数
 * @returns {Array}
 */
const second_to_date = (s) => {
    let t = ['00', '00', '00', '00'];
    if (s > -1) {
        t = [];
        const day = Math.floor(s / 3600 / 24);
        const hour = Math.floor(s / 3600) % 24;
        const min = Math.floor(s / 60) % 60;
        const sec = s % 60;
        t.push(`${day}D`);
        if (hour < 10) {
            t.push('0' + hour);
        } else {
            t.push(hour);
        }
        if (min < 10) {
            t.push('0' + min);
        } else {
            t.push(min);
        }
        if (sec < 10) {
            t.push('0' + sec);
        } else {
            t.push(sec);
        }
    };
    return t;
};

export default {
    props: ['id', 'datas', 'styles'],

    data () {
        return {
            // 定时器钩子
            timer_id: null,
            // 倒计时秒数
            spiner: ['00', '00', '00', '00'],
            // 倒计时文案
            spiner_text: '',
            // 当前状态
            status: 0
        };
    },

    computed: {
        css () {
            return '<style>' + css.call(this) + '</style>';
        },
        is_set_time () {
            return this.datas.time.length > 0;
        },
        // 开始时间
        start_time () {
            if (this.is_set_time == true) {
                const timestamp = new Date(this.datas.time[0]).getTime();
                return timestamp
            } else {
                return new Date().getTime();
            }
        },
        // 结束时间
        end_time () {
            if (this.is_set_time == true) {
                const timestamp = new Date(this.datas.time[1]).getTime();
                return timestamp
            } else {
                return new Date().getTime();
            }
        }
    },

    watch: {
        is_set_time (res) {
            res == true && this.init();
        },
        start_time () {
            this.init();
        },
        end_time () {
            this.init();
        }
    },

    methods: {
        // 初始化
        async init () {
            // 首次状态更新
            this.timer(this.start_time, this.end_time);
            // 装修页不执行倒计时
            clearInterval(this.timer_id);
            this.timer_id = setInterval(() => {
                this.timer(this.start_time, this.end_time);
            }, 1000);
        },

        // 倒计时函数
        timer (start, end) {
            // 获取状态
            this.status = get_status(start, end);
            let second = 0;
            // 判断状态
            switch (this.status) {
            case 0:
                second = get_second(start);
                this.spiner_text = 'Start In';
                break;
            case 1:
                second = get_second(end);
                this.spiner_text = 'End In';
                break;
            case 2:
                clearInterval(this.timer_id);
                this.spiner_text = 'Allready Ended';
                break;
            }
            // 更新时分秒
            this.spiner = second_to_date(second);
        }
    },

    mounted () {
        // 初始化
        this.init();
        this.$emit('loaded');
    }
};
</script>

<style lang="less" scoped>
    // 默认
    .component-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 375/37.5rem;

        // 倒计时的
        .timer {
            width: 100%;
            padding: 24 / 75rem  0;
            text-align: center;

            .timer-title {
                display: inline-block;
                font-size: 40 / 75rem;
                line-height: 54 / 75rem;
                height: 54 / 75rem;
            }
            .timer-right {
                font-size: 32 / 75rem;
            }
            span.timer-text {
                margin-right: 12 / 75rem;
            }
            span.timer-spiner {
                display: inline-block;
                height: 36 / 75rem;
                line-height: 36 / 75rem;
                padding: 0 5 / 75rem;
                text-align: center;
                font-size: 24 / 75rem;
                border-radius: 6 / 75rem;
            }
        }
    }
</style>
